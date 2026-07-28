import './global.css';
import '../themes/variables.scss';
import { ThemeProvider } from 'src/components/ThemeProvider/ThemeProvider';

export const metadata = {
  title: 'Munchers - Event Planning Made Easy',
  description: 'Connect with friends, plan events, and make memories together',
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
