import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Field } from "../components/Inputs/Field";
import ImageSelector from "../components/Inputs/ImageSelector";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../components/Modal";
import { baseurl } from "../lib/fetcher";
import { WithAuth } from "../modules/Auth/withAuth";

export default function Register() {
  const [avatar, setAvatar] = useState<File>();
  const [username, setUsername] = useState<string>();
  const [firstname, setFirstname] = useState<string>();
  const [lastname, setLastname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [cpassword, setCpassword] = useState<string>();

  const { pushModal, closeModal } = useModals();
  const { push } = useRouter();

  const handleRegister = async () => {
    if (
      // !avatar ||
      !username ||
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !cpassword
    ) {
      pushModal(<ErrorModal title="Error" body="Missing arguments" />, {
        value: 2000,
      });
      return;
    }

    const newUser = {
      username,
      firstname,
      lastname,
      email,
      password,
      cpassword,
    };
    const newUserD = new FormData();

    newUserD.append("username", username);
    newUserD.append("email", email);
    newUserD.append("first_name", firstname);
    newUserD.append("last_name", lastname);
    newUserD.append("password", password);
    newUserD.append("cpassword", cpassword);
    if (avatar) newUserD.append("avatar", avatar);

    if (password !== cpassword) {
      pushModal(<ErrorModal title="Error" body="Password do notch match" />, {
        value: 2000,
      });
      return;
    }

    const ackey = Date.now();
    pushModal(
      <LoadingModal
        key={ackey}
        title="Creating your account"
        body="This might take a bit"
      />,
      { timer: false }
    );

    try {
      const response = await axios.post(`${baseurl}/user/register/`, newUserD);

      if (response.status === 201) {
        closeModal(ackey);
        pushModal(
          <SuccessModal
            title={`Welcome ${username}`}
            body="Your account has been successfully created"
          />,
          {
            value: 3000,
          }
        );

        setTimeout(() => {
          push("/login");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeModal(ackey);
          pushModal(<ErrorModal title="Error" body={error.response.data} />);
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

  return (
    <WithAuth requiresAuth={false}>
      <div
        className="flex w-full h-full items-center justify-center"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleRegister();
        }}
      >
        <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
          <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
            Create a new account
          </div>
          <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-sm text-blue-500 underline hover:text-blue-700">
                Sign in
              </a>
            </Link>
          </span>
          <div className="p-6 mt-2 w-full">
            <div>
              <div className="flex flex-col items-center">
                <div className="flex flex-col w-32 h-32 items-center mb-2">
                  <ImageSelector
                    image={avatar}
                    setImage={setAvatar}
                    shape="circle"
                    label="Click Here"
                  />
                </div>

                <p className="text-xl font-light text-gray-700 placeholder-gray-400 shadow-sm">
                  Select an Avatar
                </p>
              </div>
              <Field
                placeholder="Username"
                data={username}
                setData={setUsername}
              />
              <div className="flex gap-4 mb-2">
                <Field
                  placeholder="First Name"
                  data={firstname}
                  setData={setFirstname}
                />
                <Field
                  placeholder="Last Name"
                  data={lastname}
                  setData={setLastname}
                />
              </div>
              <div className="flex flex-col mb-2">
                <Field placeholder="Email" data={email} setData={setEmail} />
                <Field
                  placeholder="Password"
                  type="password"
                  data={password}
                  setData={setPassword}
                />
                <Field
                  placeholder="Confirm Password"
                  type="password"
                  data={cpassword}
                  setData={setCpassword}
                />
              </div>
              <div className="flex w-full my-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => {
                    handleRegister();
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WithAuth>
  );
}
