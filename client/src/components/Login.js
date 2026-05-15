import React,
{
  useState,
} from "react";

function Login() {

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const login =
    async () => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/auth/login",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email,
                  password,
                }),
            }
          );

        const data =
          await response.json();

        if (data.token) {

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          window.location.reload();

        } else {

          alert(
            data.message
          );
        }

      } catch (err) {

        console.log(err);
      }
    };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "#f3f2f1",
      }}
    >
      <div
        style={{
          width: "400px",
          background:
            "white",
          padding: "40px",
          borderRadius:
            "10px",
        }}
      >
        <h2
          style={{
            marginBottom:
              "20px",
          }}
        >
          Employee Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          style={{
            width: "100%",
            padding: "12px",
            marginBottom:
              "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          style={{
            width: "100%",
            padding: "12px",
            marginBottom:
              "20px",
          }}
        />

        <button
          onClick={login}

          style={{
            width: "100%",
            padding: "12px",
            background:
              "#6264a7",
            color:
              "white",
            border:
              "none",
            cursor:
              "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;