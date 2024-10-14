import { Lato } from "next/font/google";
import "globals.sass";
const lato = Lato({
  weight: ["400"],
  subsets: ["latin"],
});
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
};
export default RootLayout;
