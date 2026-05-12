# ⛅ Weather App
🔗 배포 링크 → [weather-app-silver.vercel.app](https://weather-app-silver.vercel.app)

<img width="600" height="400" alt="og-tag" src="https://github.com/user-attachments/assets/d1a2591a-4696-4334-9a74-4dfeb419ea3a" />



---

## ⚙️ 프로젝트 실행 방법

### 환경 변수 설정

루트에 `.env` 파일을 생성하고 아래 키를 입력합니다.

```
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

### 실행

```bash
npm install
npm run dev
```

---

## 🗝️ 구현 기능

### 현재 위치 기반 날씨 조회
- 앱 첫 진입 시 브라우저 Geolocation API로 사용자의 현재 위치를 감지
- 현재 기온, 당일 최저/최고 기온, 날씨 아이콘, 시간대별 기온(24시간) 표시

### 행정구역 장소 검색
- 시 / 군 / 구 / 동 모든 단위로 검색 가능 (예: "서울특별시", "종로구", "청운동")
- 검색어 입력 시 매칭되는 장소 리스트 표시, 선택 시 해당 장소 날씨 조회
- 해당 장소의 날씨 정보가 없는 경우 안내 메시지 표시

### 즐겨찾기
- 검색한 장소를 즐겨찾기에 추가 / 삭제
- 최대 6개 제한, 초과 시 에러 메시지 표시
- 즐겨찾기 장소에 별칭 설정 및 수정 가능
- 새로고침 후에도 유지 (localStorage 기반)
- 즐겨찾기 카드에 현재 날씨, 당일 최저/최고 기온 표시

### 상세 페이지
- 즐겨찾기 카드 클릭 시 해당 장소의 상세 날씨 페이지로 이동
- 체감 온도, 습도, 풍속, 기압, 일출/일몰 타임라인 표시
- 새로고침 시에도 정상 작동

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, TypeScript |
| 빌드 도구 | Vite |
| 스타일링 | Tailwind CSS v4 |
| 라우팅 | React Router v6 |
| 서버 상태 관리 | TanStack Query (React Query) |
| 외부 API | OpenWeatherMap API, Kakao 주소 검색 API |
| 배포 | Vercel |

---

## 🏗 프로젝트 구조

Feature-Sliced Design(FSD) 아키텍처를 기반으로 구성했습니다.

```
src/
├── app/        # 앱 초기화, Provider, Router 설정
├── pages/      # 라우트 단위 페이지
├── widgets/    # 페이지에 올라가는 독립 UI 블록
├── features/   # 사용자 행동 단위 비즈니스 로직 + UI
├── entities/   # 도메인 모델, 타입, API 호출
└── shared/     # 범용 유틸, 공용 UI, 상수
```

---

## 💡 기술적 의사결정

### 1. 장소 검색 API — Kakao 주소 검색 API 채택

OpenWeatherMap Geocoding API는 한국 행정동 단위 주소 지원이 제한적이어서 "청운동", "종로구" 같은 세부 행정구역 검색이 정확하지 않았습니다. 카카오 주소 검색 API로 교체 후 정확한 좌표 변환이 가능해졌습니다.

```
행정구역 검색 → 카카오 API로 좌표 변환 → OpenWeather API로 날씨 조회
```

### 2. 당일 최저/최고 기온 계산

`/weather` API의 `temp_min`, `temp_max`는 현재 관측값 주변의 min/max로, 현재 온도와 거의 동일하게 나오는 문제가 있었습니다. `/forecast` API에서 오늘 날짜에 해당하는 3시간 단위 예보를 필터링하여 직접 계산하는 방식으로 변경했습니다.

```typescript
const todayTemps = forecast.list
  .filter((item) => item.dt_txt.startsWith(today))
  .map((item) => item.main.temp);
```

> OpenWeatherMap Forecast API는 현재 시점 이후의 예보 데이터를 제공하므로, 당일 최저/최고 기온은 현재 기온과 오늘 남은 예보 데이터를 기준으로 계산했습니다.

### 3. 즐겨찾기 저장 — localStorage

별도 백엔드 요구사항이 없기 때문에 localStorage 기반으로 구현했습니다. 다만 저장소 접근 로직을 repository 형태로 분리하여 추후 서버 API 또는 MSW 기반 mock API로 교체하기 쉽도록 설계했습니다.

### 4. API Key 관리

OpenWeatherMap API Key는 클라이언트 환경 변수(`VITE_`)로 관리했습니다. 프론트엔드 단독 과제 특성상 브라우저 번들에 포함될 수 있으므로, 실서비스에서는 백엔드 프록시를 통해 API Key를 보호하는 방식이 적절합니다.

### 5. 검색 debounce 적용

입력할 때마다 검색 연산이 실행되는 문제를 방지하기 위해 `useDebounce` 훅을 구현하여 300ms 지연 후 검색이 실행되도록 했습니다.

---

## 🐛 트러블슈팅

### Vercel 배포 후 새로고침 시 404 에러

**문제** `/weather/37.5/126.9` 같은 동적 경로에서 새로고침 시 404 발생

**원인** Vercel은 정적 파일 서버처럼 동작하므로, SPA 특성상 해당 경로에 실제 파일이 없어 404를 반환

**해결** 프로젝트 루트에 `vercel.json` 추가

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### 카카오 API 403 Forbidden 에러

**문제** 행정구역 검색 시 `App disabled OPEN_MAP_AND_LOCAL service` 에러 발생

**원인** 카카오 앱에서 로컬(주소 검색) API가 비활성화 상태

**해결** 카카오 개발자 콘솔 → 제품 설정 → 카카오맵 / 로컬 → 사용 설정 ON

추가로 확인한 사항:
- REST API 키 사용 필수 (JavaScript 키 사용 불가)
- Authorization 헤더 형식: `KakaoAK {REST_API_KEY}` (`Bearer` 사용 불가)
- 환경 변수 변경 시 dev 서버 재시작 필요

---

### setState updater 안에서 throw 사용으로 앱 크래시

**문제** 즐겨찾기 6개 초과 시 앱이 비정상 종료됨

**원인** `setState` updater 함수 내부에서 `throw`를 사용하면 React 렌더링 사이클에서 예외가 발생하여 앱 전체가 크래시됨

**해결** `addFavorite`의 반환 타입을 `boolean`으로 변경하고, 호출부에서 반환값으로 에러 처리

```typescript
// 변경 전 — setState 내부에서 throw
if (prev.length >= MAX_COUNT) {
  throw new Error("즐겨찾기는 최대 6개까지 가능합니다.");
}

// 변경 후 — boolean 반환으로 처리
if (favorites.length >= MAX_COUNT) return false;
setFavorites((prev) => [...prev, favorite]);
return true;
```

---

### 즐겨찾기 카드 로딩 시 스켈레톤 미표시

**문제** 즐겨찾기 카드 로딩 중 스켈레톤이 보이지 않고 텍스트만 표시됨

**원인** `useWeatherQuery`를 카드 컴포넌트 내부에서 호출하고 있어 로딩 상태의 소유권이 카드 안에 있었는데, 외부에서 `isLoading` prop으로 제어하려 해서 타이밍이 맞지 않았음

**해결** 데이터 소유권이 컴포넌트 내부에 있으면 로딩 처리도 내부에서 직접 해야 한다는 원칙에 따라, 카드 컴포넌트에서 직접 스켈레톤을 반환하도록 변경

```tsx
if (isLoading) return <FavoriteWeatherCardSkeleton />;
```

---

## 📌 회고

처음엔 "날씨 조회 앱" 수준이었지만, 점진적인 리팩토링과 구조 개선을 통해 유지보수성과 사용자 경험을 함께 고려하는 방향으로 발전시켰습니다.
