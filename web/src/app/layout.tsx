import './global.css';
import '../themes/variables.scss';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Munchers - Event Planning Made Easy',
  description: 'Connect with friends, plan events, and make memories together',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
