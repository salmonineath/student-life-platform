// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//   loginAction,
//   registerAction,
//   getMeAction,
//   logoutAction,
// } from "./action";
// import { AuthUser, AuthState } from "@/types/authType";

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder

//       // ── Login ──────────────────────────────────────────
//       .addCase(loginAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         loginAction.fulfilled,
//         (
//           state,
//           action: PayloadAction<{ user: AuthUser; accessToken: string }>,
//         ) => {
//           state.loading = false;
//           state.user = action.payload.user;
//           state.accessToken = action.payload.accessToken;
//         },
//       )
//       .addCase(loginAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // ── Register ───────────────────────────────────────
//       .addCase(registerAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         registerAction.fulfilled,
//         (state, action: PayloadAction<{ user: AuthUser }>) => {
//           state.loading = false;
//           state.user = action.payload.user;
//         },
//       )
//       .addCase(registerAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // ── Get Me ─────────────────────────────────────────
//       .addCase(
//         getMeAction.fulfilled,
//         (state, action: PayloadAction<AuthUser>) => {
//           state.user = action.payload; // overwrite with freshest data from server
//         },
//       )

//       // ── Logout ─────────────────────────────────────────
//       .addCase(logoutAction.fulfilled, (state) => {
//         state.user = null;
//         state.accessToken = null;
//         state.error = null;
//       })
//       .addCase(logoutAction.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearError } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginAction, registerAction, getMeAction, logoutAction } from "./action";
import { AuthUser, AuthState } from "@/types/authType";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Login ──────────────────────────────────────────
      .addCase(loginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAction.fulfilled,
        (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        },
      )
      .addCase(loginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── Register ───────────────────────────────────────
      .addCase(registerAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerAction.fulfilled,
        (state, action: PayloadAction<{ user: AuthUser }>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(registerAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── Get Me ─────────────────────────────────────────
      .addCase(getMeAction.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
      })

      // ── Logout ─────────────────────────────────────────
      .addCase(logoutAction.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
