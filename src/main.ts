import { bootstrapApplication } from "@angular/platform-browser";
import * as Sentry from "@sentry/angular";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

Sentry.init({
	dsn: "https://b3b9c7fb5b9e6077955d96b930818a15@o4507057023811584.ingest.us.sentry.io/4507063087726592",
	integrations: [
		Sentry.browserTracingIntegration({
			enableInp: true,
		}),
		Sentry.replayIntegration({
			maskAllText: true, // テキストを全てマスクする
			blockAllMedia: true, // 画像を全て非表示にする
		}),
	],
	tracePropagationTargets: ["localhost"],
	tracesSampleRate: 1, // trace only prod environment
	environment: "local",
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 1,
	ignoreErrors: [],
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err),
);
