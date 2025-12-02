// 관리자 로그인 API
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '비밀번호를 입력해주세요.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 관리자 비밀번호 조회
    const admin = await env['jauto-db'].prepare(
      'SELECT * FROM admin ORDER BY id DESC LIMIT 1'
    ).first();

    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '관리자 계정이 없습니다.'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 비밀번호 비교
    if (admin.password !== password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '비밀번호가 올바르지 않습니다.'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 단순히 성공만 반환
    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '로그인 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

