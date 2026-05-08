const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

export const getCoordsByKakao = async (query: string) => {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("카카오 API 요청 실패");
  }

  return res.json();
};
