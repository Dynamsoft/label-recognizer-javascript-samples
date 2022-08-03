# Recognize and Parse machine-readable zones (MRZ)

This sample demonstrates the most popular use case of **Dynamsoft Label Recognizer**, which is to read and parse the machine-readable zones (MRZ) usually found on passports, VISAs, etc.

> For a more complex sample, check out the [demo for MRZ reading](https://demo.dynamsoft.com/label-recognizer-js/mrz-scanner.html) or its [source code](https://github.com/Dynamsoft/label-recognizer-javascript-demo).

## Prerequisites

* A device with an accessible camera, such as a mobile phone or a computer with a webcam.
* A passport, a ID card, a VISA or a picture of such documents where there is a machine-readable zone to read.

## How it works

The following shows the workflow:

1. An instance of Dynamsoft Label Recognizer SDK (`recognizer`) is created and sets itself up for MRZ reading;

    ```js
    recognizer.updateRuntimeSettingsFromString("video-mrz");
    ```

2. An instance of Dynamsoft Camera Enhancer SDK (`cameraEnhancer`) is used to open the camera and display its video feed on the page;
3. `recognizer` sets `cameraEnhancer` as its image source and (internally) requires it to cropped the video frames and provide only a narrow rectangular part of them as images to be read;
4. `recognizer` reads these images, recognize all the characters of the machine-readable zone and assemble them as MRZ results (multiple lines of text);
5. The MRZ results are parsed in the function `parseMrzAndUpdateDom()` into meaningful information, which is shown on the page.

    ```js
    recognizer.onMRZRead = (txt, results) => {
        parseMrzAndUpdateDom(results);
    }
    ```

## Contact Us

If you have any questions with these samples, feel free to submit an issue or [contact us](https://www.dynamsoft.com/company/contact/).
