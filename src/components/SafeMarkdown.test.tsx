import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SafeMarkdown from './SafeMarkdown';

describe('SafeMarkdown', () => {
  it('renders GFM tables without crashing', () => {
    const html = renderToStaticMarkup(
      <SafeMarkdown content={'| Name | Value |\n| --- | --- |\n| One | Two |'} />,
    );

    expect(html).toContain('<table>');
    expect(html).toContain('<td>Two</td>');
  });

  it('does not render remote images', () => {
    const html = renderToStaticMarkup(
      <SafeMarkdown content={'![tracking pixel](https://tracker.example/pixel.png)'} />,
    );

    expect(html).not.toContain('<img');
    expect(html).toContain('remote image blocked: tracking pixel');
  });
});
