// "use client";

// import { useSelector } from "react-redux";

// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     FB?: any;
//     fbAsyncInit?: () => void;
//   }
// }

// export default function MetaConnectButton() {
//   const [sdkLoaded, setSdkLoaded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { token } = useSelector((state: any) => state.user );

//   useEffect(() => {
//     if (window.FB) {
//       setSdkLoaded(true);
//       return;
//     }

//     const appId = process.env.NEXT_PUBLIC_META_APP_ID;
//     const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID;

//     console.log("Meta App ID:", appId);
//     console.log("Meta Config ID:", configId);

//     if (!appId) {
//       console.error("NEXT_PUBLIC_META_APP_ID is missing");
//       return;
//     }

//     if (!configId) {
//       console.error("NEXT_PUBLIC_META_CONFIG_ID is missing");
//       return;
//     }

//     window.fbAsyncInit = function () {
//       window.FB?.init({
//         appId: process.env.NEXT_PUBLIC_META_APP_ID,
//         cookie: true,
//         xfbml: false,
//         version: "v26.0",
//       });

//       setSdkLoaded(true);
//     };

//     const script = document.createElement("script");

//     script.src = "https://connect.facebook.net/en_US/sdk.js";
//     script.async = true;
//     script.defer = true;
//     script.crossOrigin = "anonymous";

//     document.body.appendChild(script);

//     return () => {
//       window.fbAsyncInit = undefined;
//     };
//   }, []);

//   const handleConnect = () => {
//     if (!window.FB) {
//       console.error("Meta SDK is not loaded");
//       return;
//     }

//     setLoading(true);

//     window.FB.login(
//       // (response: any) => {
//       //   console.log("META LOGIN RESPONSE:", response);
//       //   setLoading(false);
//       // }
//       (response: any) => {
//         console.log("========== META RESPONSE ==========");
//         console.log(response);

//         const code = response?.authResponse?.code;

//         console.log(
//           "CODE:",
//           code ? "RECEIVED" : "MISSING",
//         );

//         if (!code) {
//           console.error(
//             "No authorization code returned by Meta",
//           );
//           setLoading(false);
//           return;
//         }

//         fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/callback/`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//                "Authorization": `Token ${token}`
//             },
//             credentials: "include",
//             body: JSON.stringify({
//               code,
//             }),
//           },
//         )
//           .then((res) => {
//             console.log(
//               "DJANGO STATUS:",
//               res.status,
//             );

//             return res.json();
//           })
//           .then((data) => {
//             console.log(
//               "DJANGO RESPONSE:",
//               data,
//             );
//           })
//           .catch((error) => {
//             console.error(
//               "DJANGO REQUEST ERROR:",
//               error,
//             );
//           })
//           .finally(() => {
//             setLoading(false);
//           });
//       },
//       {
//         config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
//         response_type: "code",
//         override_default_response_type: true,
//         extras: {
//           setup: {},
//         },
//       },
//     );
//   };

//   const disabled = !sdkLoaded || loading;

//   return (
//     <button
//       type="button"
//       onClick={handleConnect}
//       disabled={disabled}
//       className="
//         flex
//         w-full
//         items-center
//         justify-center
//         gap-3
//         rounded-md
//         bg-[#1877F2]
//         px-5
//         py-3
//         text-[15px]
//         font-semibold
//         text-white
//         transition
//         duration-150
//         hover:bg-[#166FE5]
//         active:bg-[#145FCC]
//         disabled:cursor-not-allowed
//         disabled:opacity-60
//         focus:outline-none
//         focus:ring-2
//         focus:ring-[#1877F2]
//         focus:ring-offset-2
//       "
//     >
//       {loading ? (
//         <>
//           <svg
//             className="h-5 w-5 animate-spin"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <circle
//               cx="12"
//               cy="12"
//               r="9"
//               stroke="currentColor"
//               strokeWidth="3"
//               opacity="0.3"
//             />
//             <path
//               d="M21 12a9 9 0 0 0-9-9"
//               stroke="currentColor"
//               strokeWidth="3"
//               strokeLinecap="round"
//             />
//           </svg>

//           Connecting...
//         </>
//       ) : !sdkLoaded ? (
//         "Loading Meta..."
//       ) : (
//         <>
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             aria-hidden="true"
//           >
//             <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.004 10.125 11.927v-8.432H7.078v-3.495h3.047V9.413c0-3.017 1.792-4.687 4.533-4.687 1.312 0 2.686.236 2.686.236v2.976h-1.514c-1.491 0-1.956.93-1.956 1.885v2.25h3.328l-.532 3.495h-2.796V24C19.612 23.077 24 18.092 24 12.073z" />
//           </svg>

//           Connect to Meta
//         </>
//       )}
//     </button>
//   );
// }


"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

type MetaConnectButtonProps = {
  onConnected?: () => void;
};

export default function MetaConnectButton({
  onConnected,
}: MetaConnectButtonProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector(
    (state: any) => state.user,
  );

  useEffect(() => {
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    const appId =
      process.env.NEXT_PUBLIC_META_APP_ID;

    const configId =
      process.env.NEXT_PUBLIC_META_CONFIG_ID;

    console.log("Meta App ID:", appId);
    console.log("Meta Config ID:", configId);

    if (!appId) {
      console.error(
        "NEXT_PUBLIC_META_APP_ID is missing",
      );
      return;
    }

    if (!configId) {
      console.error(
        "NEXT_PUBLIC_META_CONFIG_ID is missing",
      );
      return;
    }

    window.fbAsyncInit = function () {
      window.FB?.init({
        appId,
        cookie: true,
        xfbml: false,
        version: "v26.0",
      });

      setSdkLoaded(true);
    };

    const script = document.createElement("script");

    script.src =
      "https://connect.facebook.net/en_US/sdk.js";

    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    document.body.appendChild(script);

    return () => {
      window.fbAsyncInit = undefined;
    };
  }, []);

  /**
   * Send the Meta authorization code to Django.
   */
  const sendCodeToDjango = async (
    code: string,
  ) => {
    try {
      console.log(
        "Sending Meta code to Django...",
      );

      const djangoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/callback/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },

          credentials: "include",

          body: JSON.stringify({
            code,
          }),
        },
      );

      console.log(
        "DJANGO STATUS:",
        djangoResponse.status,
      );

      const data =
        await djangoResponse.json();

      console.log(
        "DJANGO RESPONSE:",
        data,
      );

      if (
        djangoResponse.ok &&
        data.success &&
        data.connected
      ) {
        console.log(
          "META CONNECTION SUCCESSFUL",
        );

        /*
         * Tell meta/page.tsx that the connection
         * was successfully completed.
         */
        onConnected?.();

        return;
      }

      console.error(
        "META CONNECTION FAILED:",
        data,
      );
    } catch (error) {
      console.error(
        "DJANGO REQUEST ERROR:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (!window.FB) {
      console.error(
        "Meta SDK is not loaded",
      );
      return;
    }

    if (!token) {
      console.error(
        "Authentication token is missing",
      );
      return;
    }

    setLoading(true);

    /*
     * IMPORTANT:
     *
     * FB.login expects a normal callback.
     * Do NOT make this callback async.
     */
    window.FB.login(
      (response: any) => {
        console.log(
          "========== META RESPONSE ==========",
        );

        console.log(response);

        const code =
          response?.authResponse?.code;

        console.log(
          "CODE:",
          code ? "RECEIVED" : "MISSING",
        );

        if (!code) {
          console.error(
            "No authorization code returned by Meta",
          );

          setLoading(false);

          return;
        }

        /*
         * Call the async function separately.
         */
        sendCodeToDjango(code);
      },
      {
        config_id:
          process.env
            .NEXT_PUBLIC_META_CONFIG_ID,

        response_type: "code",

        override_default_response_type: true,

        extras: {
          setup: {},
        },
      },
    );
  };

  const disabled =
    !sdkLoaded || loading;

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={disabled}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-md
        bg-[#1877F2]
        px-5
        py-3
        text-[15px]
        font-semibold
        text-white
        transition
        duration-150
        hover:bg-[#166FE5]
        active:bg-[#145FCC]
        disabled:cursor-not-allowed
        disabled:opacity-60
        focus:outline-none
        focus:ring-2
        focus:ring-[#1877F2]
        focus:ring-offset-2
      "
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.3"
            />

            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          Connecting...
        </>
      ) : !sdkLoaded ? (
        "Loading Meta..."
      ) : (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.004 10.125 11.927v-8.432H7.078v-3.495h3.047V9.413c0-3.017 1.792-4.687 4.533-4.687 1.312 0 2.686.236 2.686.236v2.976h-1.514c-1.491 0-1.956.93-1.956 1.885v2.25h3.328l-.532 3.495h-2.796V24C19.612 23.077 24 18.092 24 12.073z" />
          </svg>

          Connect to Meta
        </>
      )}
    </button>
  );
}