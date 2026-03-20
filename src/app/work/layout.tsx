export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      animation: 'workPageFadeIn 300ms ease both',
    }}>
      {children}
    </div>
  );
}
