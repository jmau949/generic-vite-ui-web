import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
// import { getTheme } from "@/actions/settings-actions";
// import { Theme } from '@/types/settings';

const RootLayout = (props) => {
  //   const [theme, setTheme] = useState(null);

  //   useEffect(() => {
  //     const fetchTheme = async () => {
  //       const themeData = await getTheme();
  //       setTheme(themeData);
  //     };
  //     fetchTheme();
  //   }, []);

  return (
    <div
      className={clsx(
        "bg-grey5"
        //   theme === Theme.LIGHT && 'theme:light',
        //   theme === Theme.LIGHT_HIGH_CONTRAST && 'theme:light-high-contrast',
        //   theme === Theme.DARK && 'theme:dark',
        //   theme === Theme.DARK_HIGH_CONTRAST && 'theme:dark-high-contrast',
        //   theme === Theme.DARK && 'dark',
        //   theme === Theme.DARK_HIGH_CONTRAST && 'dark'
      )}
    >
      {props.children}
    </div>
  );
};

export default RootLayout;
