import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import type ImmersiveSceneType from './ImmersiveScene';

const ImmersiveScene = lazy(() => import('./ImmersiveScene'));
type Props = ComponentProps<typeof ImmersiveSceneType>;

function SceneLoading({ mode = 'hero' }: Pick<Props, 'mode'>) {
  return <div className={`scene-fallback scene-fallback--${mode}`} role="img" aria-label="Loading Aman Labs architectural visual"><div className="fallback-orbit fallback-orbit--a" /><div className="fallback-orbit fallback-orbit--b" /><div className="fallback-core"><span>AS</span><i /></div><div className="fallback-label">3D / LOADING</div></div>;
}

export default function SceneIsland(props: Props) {
  return <Suspense fallback={<SceneLoading mode={props.mode} />}><ImmersiveScene {...props} /></Suspense>;
}
