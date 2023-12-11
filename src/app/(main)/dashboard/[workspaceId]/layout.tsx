import React from 'react'

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout:React.FC<LayoutProps> = ({children, params}) => {
  return <div className=''>
    {children}
  </div>
}

export default Layout