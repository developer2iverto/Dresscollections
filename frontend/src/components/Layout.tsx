import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = "pt-6" }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout
