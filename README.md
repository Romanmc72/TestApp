# r0m4n Scoreboard

This is my first app! I built this to mimic the functionality of the scoreboard website that I built on Python's flask + Vue.js + Kubernetes + Redis. This will still use that same backend that the other scoreboard uses, and in fact does operate in the same data so you can have some folks on the app and some on the website and they'll both work together. To see the web version, check it out [here](https://scoreboard.r0m4n.com/). The app currently is only available in the USA on iOS. You can find it on the Apple App store under the name `r0m4n scoreboard` for iPhone & iPad for FREE.

## Using the code

This uses the [expo](https://docs.expo.dev/) tool to build a [react-native](https://reactnative.dev/) app, which is essentially Javascript written in the React framework that gets cross-compiled into Swift/Objective-C/C#/Java or whatever it needs to be for the given platform it is being deployed on. I think for iOS it is Swift. Then it uses [eas](https://docs.expo.dev/submit/ios/) to submit the app to the app store. You can see some of the common commands in the [package.json](./package.json) under the `"scripts"` section. 

### Those commands

```bash
expo start
```

will start an interactive localhost instance that allows you to "run" the app on your device using the Expo app. Updates to the code here then get updated on your device in realtime making for a very sleek developer experience.

Then when all is ready 

```bash
expo build:ios
```

builds the app into a standalone file and

```
eas submit \
    --platform ios \
    --url <url from the build command>
```

will actually push the built app to the app store based on the configuration of [eas.json](./eas.json). So if you didn't catch it, there is absolutely ZERO need to have xCode or an apple computer in order to develop an app for the iOS/Apple ecosystem, and I think that's just fantastic.

### Getting Set Up

You will need to have [nodejs](https://nodejs.org/en/download/) installed, then using `npm` you can install everything else.

`expo` and `eas` are installed globally, but the rest of this stuff you can install into this repository's directory for running things locally.

```bash
# Install these 2 globally
sudo npm install --global expo-cli
sudo npm install --global eas-cli
# The rest can install via npm at the root of the repo
npm install
```

You will want to set up a free personal account on [expo](https://expo.dev/) in order to get started using it. I highly recommend because it makes for such a smooth development experience. Also all of the code here requires it.

Additionally! To even *try to publish* an app to the Apple App Store, you *need to have* an apple developer account. This is **NOT FREE**, which blows. It costs $99/year, and you can get started [here](https://developer.apple.com/programs/enroll/).

### WhY nOt AnDrOiD aNd WhY nOt OtHeR cOuNtRiEs

I just haven't tested on an Android emulator yet, also I only know english and since I am using `HTTPS` to call the APIs, I do not want to go through the hassle of filling out a report on "[what encryption I am exporting outside of the USA](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations)", since the app is all open source and only uses basic `HTTPS` libraries, I think I am exempt anyway but, I don't F with uncle sam. Also, like I said, this is my first app, it is published open source, for free, using my own money, so [G.O.M.D](https://www.youtube.com/watch?v=vHU6ZRQJ50Q).

If you want it more broadly available, support me on [Patreon](https://www.patreon.com/r0m4n) or fight me.
