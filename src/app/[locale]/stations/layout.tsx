import { ReactNode } from 'react';

export default function StationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}