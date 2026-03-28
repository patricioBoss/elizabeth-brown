import Script from 'next/script';
import { useRef } from 'react';

export default function TawkMessenger() {
  const tawkMessengerRef = useRef<any>();

  return (
    <Script type="text/javascript">
      {`
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69c5135be85b2f1c34e634ec/1jkkt77fj';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
    </Script>
  );
}
