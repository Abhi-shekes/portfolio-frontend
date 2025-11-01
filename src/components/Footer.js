const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Abhishek Tiwari</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full Stack Developer passionate about creating innovative web solutions 
              with modern technologies.
            </p>
          </div>

          {/* Connect Section */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-4">Let's Connect</h4>
            <div className="flex justify-center md:justify-end">
              <a 
                href="https://www.linkedin.com/in/abhishek-tiwari-6172a6223/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors duration-300 px-4 py-2 border border-gray-700 rounded-lg hover:border-blue-400"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Abhishek Tiwari. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Built with ❤️ using React & Node.js</span>
              <div className="flex space-x-2">
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">React</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Node.js</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;