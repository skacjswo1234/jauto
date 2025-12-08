// 문의 목록 조회 API
export async function onRequestGet(context: any) {
  const { request, env } = context;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    // 기본 300건, 최대 1000건까지 조회하도록 제한
    const rawLimit = parseInt(searchParams.get('limit') || '300');
    const limit = Math.min(Math.max(rawLimit, 1), 1000);
    const offset = (page - 1) * limit;
    const search = (searchParams.get('search') || '').trim();

    // 검색 조건 구성
    const whereClause = search ? 'WHERE name LIKE ? OR phone LIKE ?' : '';
    const searchParamsArray = search ? [`%${search}%`, `%${search}%`] : [];

    // 전체 개수 조회
    const countResult = await env['jauto-db'].prepare(
      `SELECT COUNT(*) as total FROM inquiries ${whereClause}`
    ).bind(...searchParamsArray).first();

    // 문의 목록 조회
    const result = await env['jauto-db'].prepare(
      `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(...searchParamsArray, limit, offset).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: result.results,
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// 문의 등록 API
export async function onRequestPost(context: any) {
  const { request, env } = context;

  // CORS preflight 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    const body = await request.json();
    const { name, phone, car_name, usage_type, ip_address } = body;

    // 필수 필드 검증
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '이름과 연락처는 필수 입력 항목입니다.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // IP 주소 가져오기
    const clientIp = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     ip_address || 
                     'unknown';

    // 데이터베이스에 저장
    const result = await env['jauto-db'].prepare(
      `INSERT INTO inquiries (name, phone, car_name, usage_type, ip_address, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(
      name,
      phone,
      car_name || null,
      usage_type || null,
      clientIp
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.meta.last_row_id
        }
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// OPTIONS 요청 처리 (CORS)
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

