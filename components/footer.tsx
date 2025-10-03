import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          {/* Left Section - Logo and Company Name */}
          <div className="flex items-start space-x-4">
            {/* NSB Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/NSB FOOTER.png" 
                alt="NEWSTATE BRANDING CO." 
                className="h-16 w-auto"
              />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-white h-16 mx-8"></div>

          {/* Right Section - Company Info */}
          <div className="flex flex-col space-y-2">
            <div className="text-white uppercase font-normal tracking-wide">
              NEWSTATE BRANDING CO.
            </div>
            <div className="text-white uppercase font-normal tracking-wide">
              USA | GLOBAL MANUFACTURING
            </div>
            <div className="text-white uppercase font-normal tracking-wide">
              WWW.NEWSTATEBRANDING.COM
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
