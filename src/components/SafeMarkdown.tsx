import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isRemoteResource } from '../lib/privacy';

interface SafeMarkdownProps {
  content: string;
}

const SafeMarkdown = ({ content }: SafeMarkdownProps) => (
  <div className="prose prose-sm max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt }) =>
          isRemoteResource(src) ? (
            <span className="text-xs opacity-70" title={src}>
              [remote image blocked: {alt || 'image'}]
            </span>
          ) : (
            <img src={src} alt={alt || ''} loading="lazy" />
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default SafeMarkdown;
