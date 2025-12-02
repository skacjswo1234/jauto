// 관리자 비밀번호 변경 API
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // 필수 필드 검증
    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 새 비밀번호 길이 검증
    if (newPassword.length < 4) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '새 비밀번호는 최소 4자 이상이어야 합니다.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 현재 비밀번호 확인
    const admin = await env['jauto-db'].prepare(
      'SELECT * FROM admin ORDER BY id DESC LIMIT 1'
    ).first();

    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '관리자 계정을 찾을 수 없습니다.'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 현재 비밀번호 확인
    if (admin.password !== currentPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '현재 비밀번호가 올바르지 않습니다.'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    if (currentPassword === newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 비밀번호 업데이트
    const result = await env['jauto-db'].prepare(
      `UPDATE admin 
       SET password = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(newPassword, admin.id).run();

    if (result.meta.changes === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '비밀번호 변경에 실패했습니다.'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '비밀번호가 변경되었습니다.'
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
        error: error.message || '비밀번호 변경 중 오류가 발생했습니다.'
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

