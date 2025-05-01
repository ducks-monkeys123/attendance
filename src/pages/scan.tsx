import Typography from '@mui/material/Typography';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';
import { useGlobal } from '../functions/global-context';
import { FormParameters, GatheringTimes, User } from '../types/types';

export default function ScanPage() {
  const hasScanned = useRef(false); // ✅ Tracks if scan was already handled
  const { user, setUser } = useGlobal();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        if (hasScanned.current) return; // ✅ Ignore further scans
        hasScanned.current = true;

        try {
          setUser(JSON.parse(decodedText) as User);
          console.log('Parsed JSON from QR code:', user);
          alert(`First name: ${user.first_name}, Surname: ${user.surname}`);
        } catch (err) {
          console.warn('Scanned text is not valid JSON:', decodedText);
          alert(`Scanned Text: ${decodedText}`);
        }
      },
      (errorMessage) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.warn('Failed to clear scanner:', error);
      });
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <Typography variant="h5" gutterBottom>
        QR Code Scanner
      </Typography>
      <div
        id="reader"
        style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          aspectRatio: '1 / 1',
        }}
      ></div>
    </div>
  );
}
