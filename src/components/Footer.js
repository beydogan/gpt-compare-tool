import { Github, Twitter } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-white rounded-lg p-6 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex text-sm text-gray-600">
          Built by&nbsp;<a
            href="https://github.com/beydogan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-gray-900 flex items-center"
          >
            beydogan
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/beydogan/gpt-compare-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <Github className="h-5 w-5 mr-1" />
          </a>
          <a
            href="https://x.com/beydogan_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <Twitter className="h-5 w-5 mr-1" />
          </a>
        </div>
      </div>
    </footer>
  );