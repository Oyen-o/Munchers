import './global.css';
import '../themes/variables.scss';
import { ThemeProvider } from 'src/components/ThemeProvider/ThemeProvider';

export const metadata = {
  title: 'Munchers - Share places. Plan together.',
  description:
    'Discover and share places, events, and experiences through trusted friends and communities.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
