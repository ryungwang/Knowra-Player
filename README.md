# Haru Player

React + HTML5 video 기반의 재사용 가능한 플레이어 라이브러리입니다.

## Components

- `HaruPlayer`: 유튜브 느낌의 16:9 가로형 플레이어
- `ShortsPlayer`: 쇼츠/릴스 느낌의 9:16 세로형 플레이어
- `PostPlayer`: 커뮤니티 게시글 안에 들어가는 인스타그램 느낌의 인라인 플레이어
- `BasePlayer`: 직접 UI를 조립할 때 쓰는 render-prop 기반 베이스 플레이어

## Features

- 재생, 일시정지, 10초 이동, seek, 버퍼 표시
- 볼륨 슬라이더, 음소거, 재생 속도, 반복 재생
- 전체화면, 극장 모드, Picture-in-Picture
- 키보드 조작: `Space`, `K`, `J`, `L`, 방향키, `M`, `F`, `I`
- IntersectionObserver 기반 세로형 자동재생
- 전역 재생 레지스트리 기반 동시 재생 방지
- 좋아요, 저장, 공유, 팔로우 등 피드형 UI 상태
- TypeScript 타입 정의 포함
- 재생/정지/진행/에러/액션 이벤트 콜백 제공

## Install

```bash
cd <path-to-Haru-Player>
npm install
```

소비 프로젝트에서 로컬 폴더를 직접 설치할 수 있습니다. `prepare` 훅이 자동으로 라이브러리 빌드를 수행합니다.

```bash
npm install <path-to-Haru-Player>
```

tarball로 고정 설치하려면:

```bash
cd <path-to-Haru-Player>
npm pack
```

소비 프로젝트:

```bash
npm install <path-to-Haru-Player>\haru-player-0.1.0.tgz
```

## Usage

```jsx
import { HaruPlayer, ShortsPlayer, PostPlayer } from 'haru-player';
import 'haru-player/style.css';

export default function Page() {
  return (
    <>
      <HaruPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        title="Haru sample video"
        onPlay={({ video }) => console.log('play', video.currentTime)}
        onTimeUpdate={({ currentTime, duration }) => {
          console.log({ currentTime, duration });
        }}
      />

      <ShortsPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        title="Short form sample"
        author="haru.creator"
        caption="Vertical autoplay player"
        onLikeChange={(liked) => console.log({ liked })}
      />

      <PostPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        title="Community sample"
        author="haru.media"
        caption="Inline post player"
        onShare={() => console.log('share')}
      />
    </>
  );
}
```

다중 source도 지원합니다.

```jsx
<HaruPlayer
  title="Adaptive source sample"
  sources={[
    { src: '/media/video.webm', type: 'video/webm' },
    { src: '/media/video.mp4', type: 'video/mp4' },
  ]}
/>
```

## Common Props

| Prop | Type | Description |
| --- | --- | --- |
| `src` | `string` | 비디오 URL |
| `sources` | `{ src: string, type?: string }[]` | 여러 비디오 source 후보 |
| `poster` | `string` | 포스터 이미지 URL |
| `title` | `string` | 플레이어 제목 또는 캡션 fallback |
| `autoPlay` | `boolean` | 진입 시 자동재생 |
| `className` | `string` | 루트 엘리먼트에 추가할 클래스 |
| `style` | `React.CSSProperties` | 루트 엘리먼트 inline style |
| `videoProps` | `React.VideoHTMLAttributes<HTMLVideoElement>` | 내부 video 엘리먼트 추가 속성 |

## Media Event Callbacks

| Callback | Payload |
| --- | --- |
| `onPlay` | `{ video }` |
| `onPause` | `{ video }` |
| `onEnded` | `{ video }` |
| `onWaiting` | `{ video }` |
| `onCanPlay` | `{ video }` |
| `onTimeUpdate` | `{ video, currentTime, duration }` |
| `onDurationChange` | `{ video, currentTime, duration }` |
| `onProgress` | `{ video, buffered, currentTime, duration }` |
| `onVolumeChange` | `{ video, volume, muted }` |
| `onRateChange` | `{ video, playbackRate }` |
| `onError` | `{ video, message, error }` |

## Component Props

### HaruPlayer

| Prop | Type | Description |
| --- | --- | --- |
| `theaterMode` | `boolean` | 극장 모드 상태 |
| `onToggleTheater` | `function` | 극장 모드 토글 핸들러 |

### ShortsPlayer

| Prop | Type | Description |
| --- | --- | --- |
| `author` | `string` | 작성자 표시명 |
| `avatar` | `string` | 작성자 아바타 URL |
| `caption` | `string` | 하단 캡션 |
| `likes` | `number` | 초기 좋아요 수 |
| `comments` | `number` | 댓글 수 |
| `shares` | `number` | 공유 수 |
| `loop` | `boolean` | 반복 재생 |
| `autoPlayOnView` | `boolean` | 뷰포트 진입 시 자동재생 |
| `onLikeChange` | `(liked: boolean) => void` | 좋아요 상태 변경 |
| `onSaveChange` | `(saved: boolean) => void` | 저장 상태 변경 |
| `onFollowChange` | `(followed: boolean) => void` | 팔로우 상태 변경 |
| `onComment` | `() => void` | 댓글 액션 |
| `onShare` | `() => void` | 공유 액션 |

### PostPlayer

| Prop | Type | Description |
| --- | --- | --- |
| `author` | `string` | 작성자 표시명 |
| `avatar` | `string` | 작성자 아바타 URL |
| `location` | `string` | 위치 또는 보조 텍스트 |
| `caption` | `string` | 게시글 캡션 |
| `likes` | `number` | 초기 좋아요 수 |
| `comments` | `number` | 댓글 수 |
| `mutedByDefault` | `boolean` | 최초 음소거 여부 |
| `onLikeChange` | `(liked: boolean) => void` | 좋아요 상태 변경 |
| `onSaveChange` | `(saved: boolean) => void` | 저장 상태 변경 |
| `onComment` | `() => void` | 댓글 액션 |
| `onShare` | `() => void` | 공유 액션 |
| `onMore` | `() => void` | 더보기 액션 |

## Package Contents

배포 패키지는 런타임에 필요한 파일만 포함합니다.

- `dist/haru-player.js`
- `dist/haru-player.cjs`
- `dist/style.css`
- `types/index.d.ts`
- `README.md`
- `package.json`

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
npm pack --dry-run
npm audit --omit=dev
```
