import { combineReducers } from "redux";
import themeReducer from "./slices/themeSlice";
import alertReducer from "./slices/alertSlice";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
	theme: themeReducer,
	alert: alertReducer,
});

const persistConfig = {
	key: "root",
	storage,  // 무조건 넣기 (클라이언트에서만 사용하니까)
	whitelist: ["theme"],
};

const isClient = typeof window !== "undefined";

const persistedReducer = isClient
	? persistReducer(persistConfig, rootReducer)
	: rootReducer;

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = isClient ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;