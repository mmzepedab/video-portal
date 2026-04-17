'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <SwaggerUI url="/api/openapi" />
    </div>
  );
}
