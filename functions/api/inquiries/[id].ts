// 특정 문의 조회 API
export async function onRequestGet(context: any) {
  const { request, env, params } = context;
  
  try {
    const id = params.id;

    const result = await env['jauto-db'].prepare(
      'SELECT * FROM inquiries WHERE id = ?'
    ).bind(id).first();

    if (!result) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '문의를 찾을 수 없습니다.'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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

// 문의 메모 업데이트 API
export async function onRequestPatch(context: any) {
  const { request, env, params } = context;
  
  // CORS preflight 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  try {
    const id = params.id;
    const body = await request.json();
    const { memo } = body;

    // 문의 존재 여부 확인
    const existing = await env['jauto-db'].prepare(
      'SELECT id FROM inquiries WHERE id = ?'
    ).bind(id).first();

    if (!existing) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '문의를 찾을 수 없습니다.'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // 메모 업데이트
    await env['jauto-db'].prepare(
      'UPDATE inquiries SET memo = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(memo || null, id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '메모가 저장되었습니다.'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

// 문의 삭제 API
export async function onRequestDelete(context: any) {
  const { request, env, params } = context;
  
  try {
    const id = params.id;

    const result = await env['jauto-db'].prepare(
      'DELETE FROM inquiries WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '문의를 찾을 수 없습니다.'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '문의가 삭제되었습니다.'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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

