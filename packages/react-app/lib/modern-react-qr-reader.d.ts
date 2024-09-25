declare module 'modern-react-qr-reader' {
  import { Component } from 'react';

  interface QrReaderProps {
    delay?: number;
    onError?: (error: string) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
  }

  export default class QrReader extends Component<QrReaderProps> {}
}
