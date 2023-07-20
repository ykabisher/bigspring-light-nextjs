import config from "@config/config.json";
import Base from "@layouts/Baseof";
import "swiper/swiper.min.css";
import { Button, Container, Form, FormGroup, FormControl, Card, FormLabel, Stack, Spinner, Row, Col } from 'react-bootstrap';
import { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as domsvg from "../lib/bundle";

const getTextBetweenScriptTags = (html) => {
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [];
  let match;

  while ((match = regex.exec(html))) {
    if (match[1].indexOf("src=") === -1 && match[1]) {
      matches.push(match[1]);
    }
  }
  return matches;
}

const Home = () => {
  const { title } = config.site;

  const [generatedHtml, setGeneratedHtml] = useState('');
  const [idea, setIdea] = useState('log in screen');
  const [uxData, setUXData] = useState('{"screens":[{"designTitle":"Login Screen","mustBeComponentsList":["TopNavbar"]}],"designSummary":"A login screen design."}');
  const [uxInstructions, setUXInstructions] = useState(`The login screen design consists of several UI sections that need to be designed and built with attention to detail. Here are the instructions for each section:

  1. Header Section:
  The header section should contain the logo of the application on the left side and a link to the sign-up page on the right side. The logo should be centered vertically and horizontally. The link to the sign-up page should be aligned to the right side of the header section.
  
  2. Login Form Section:
  The login form section should contain two input fields for email and password, a checkbox for "Remember Me", and a "Forgot Password" link. The input fields should be aligned vertically and have a label above them. The "Remember Me" checkbox should be aligned to the left of the "Forgot Password" link. The "Forgot Password" link should be aligned to the right of the login form section.
  
  3. Social Login Section:
  The social login section should contain buttons for logging in with Facebook, Google, and Twitter. The buttons should be aligned horizontally and have the respective social media icons on them. The social login section should be aligned below the login form section.
  
  4. Footer Section:
  The footer section should contain links to the terms of service, privacy policy, and contact us page. The links should be aligned horizontally and have a label above them. The footer section should be aligned to the bottom of the login screen.
  
  5. Background Section:
  The background section should have a gradient color that fades from light blue to dark blue. The background section should cover the entire login screen.
  
  6. Error Message Section:
  The error message section should appear below the login form section if the user enters incorrect login credentials. The error message should be in red text and say "Incorrect email or password. Please try again." The error message section should disappear once the user enters correct login credentials.
  
  7. Success Message Section:
  The success message section should appear below the login form section if the user successfully logs in. The success message should be in green text and say "Welcome back! You have successfully logged in." The success message section should disappear after a few seconds.
  
  8. Loading Spinner Section:
  The loading spinner section should appear below the login form section if the user clicks the "Log In" button. The loading spinner should spin until the login process is complete. The loading spinner section should disappear once the login process is complete.
  
  By following these instructions, you can design and build a login screen that is both functional and visually appealing.
`);
  const [showSpinner, setShowSpinner] = useState(false);
  const [htmlCode, setHTMLCode] = useState(``)
  const [svgDesktop, setSVGDesktop] = useState('')
  const [svgPhone, setSVGPhone] = useState('')
  const htmlCodeRef = useRef('')
  const [isOneScreen, setIsOneScreen] = useState(true)
  const iframeMobileRef = useRef();
  const iframeDesktopRef = useRef();
  const handleIdeaGeneration = async () => {
    setShowSpinner(true);

    const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/get_relevant_screens?debug=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idea, userId: 123, isOneScreen })
    });
    const jsResp = await response.json()
    setUXData(JSON.stringify(jsResp))
    setShowSpinner(false);
  };

  const handleUXGeneration = async () => {
    setShowSpinner(true);

    const uxJson = JSON.parse(uxData);
    const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/get_ux_for_screen?debug=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idea, userId: 123,
        screenArrayString: uxJson.screens.map(d => d.designTitle).join("||"),
        screenTitle: uxJson.screens[0].designTitle
      })
    });
    const jsResp = await response.json()
    setUXInstructions(jsResp.ux)
    setShowSpinner(false);
  };

  const generateHTML = async () => {
    setShowSpinner(true);

    const uxJson = JSON.parse(uxData);
    const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/screengen_stream?debug=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idea, userId: 123,
        ux: uxInstructions,
        screenTitle: uxJson.screens[0].designTitle,
        designSummary: uxJson.designSummary,
        componentsList: uxJson.screens[0].mustBeComponentsList
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const stream = await response.body;
    const reader = stream.getReader();
    let renderInterval = setInterval(() => {
      renderHTML('desktop')
    }, 1000)

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        renderHTML('desktop')
        clearInterval(renderInterval);
        break;
      }
      const decoder = new TextDecoder('utf-8');
      const parsedValue = decoder.decode(value);

      htmlCodeRef.current = htmlCodeRef.current + parsedValue;
      setHTMLCode(htmlCodeRef.current)
    }
    setShowSpinner(false);
  };

  const convertToSVG = () => {
    let iframe = iframeDesktopRef.current;
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let serializer = new XMLSerializer();
    let svgData =  serializer.serializeToString(domsvg.documentToSVG(iframeDocument).documentElement);
    setSVGDesktop(svgData)

     iframe = iframeMobileRef.current;
     iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
     serializer = new XMLSerializer();
     svgData =  serializer.serializeToString(domsvg.documentToSVG(iframeDocument).documentElement);
    setSVGPhone(svgData)
  }

  const renderHTML = (type) => {
    // Get the iframe element and its document object
    let iframe;
    if (type === 'phone') {
      iframe = document.getElementById("html-input-phone");
    } else {
      iframe = document.getElementById("html-input-desktop");
    }

    const doc = iframe?.contentDocument || iframe?.contentWindow?.document;

    // Insert the content into the iframe's document
    doc.body.innerHTML = htmlCodeRef.current;

    // include scripts for charts and maps
    var script = doc.createElement("script");
    script.innerHTML = getTextBetweenScriptTags(doc.body.innerHTML);
    doc.body.appendChild(script);

    // set automatic height
    setTimeout(() => {
      const body = iframe.contentWindow.document.body;
      const html = iframe.contentWindow.document.documentElement;
      const contentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) + 20;
      iframe.setAttribute("height", contentHeight + "px");
    }, 1000);
  };

  const reRenderHTML = async () => {
    renderHTML('phone')
    renderHTML('desktop')
    // const svgs = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/html_to_svg', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'text/html; charset=utf-8'
    //   },
    //   body: htmlCode
    // });
  //  const json = await svgs.json()

  convertToSVG()
  };

  //      
  return (
    <div style={{ margin: '15px' }}>

      <Container fluid>
        <Row>
          <Col style={{ minWidth: '300px', maxWidth: '300px' }}>
            <div>
              <FormLabel>
                Idea
              </FormLabel>
              <FormControl
                as="textarea"
                rows={15}
                cols={40}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
              <Form>
                <Form.Check
                  type="radio"
                  label="1 screen"
                  name="screenOptions"
                  id="screen1"
                  value={true}
                  checked={isOneScreen}
                  onChange={() => { setIsOneScreen(true) }}
                />

                <Form.Check
                  type="radio"
                  label="multiple screens"
                  name="screenOptions"
                  id="screen2"
                  value={false}
                  checked={!isOneScreen}
                  onChange={() => { setIsOneScreen(false) }}
                />
              </Form>
              <Button onClick={handleIdeaGeneration}>Generate ScreensData</Button>
              <Form>
                <FormLabel>
                  Screens JSON Data
                </FormLabel>
                <FormControl
                  as="textarea"
                  cols={40}
                  rows={15}
                  value={uxData}
                  onChange={(e) => setUXData(e.target.value)}
                />
                <Button onClick={handleUXGeneration}>Generate UX</Button>
              </Form>
            </div>
          </Col>

          <Col style={{ minWidth: '450px', maxWidth: '450px' }}>
            <Form>
              <FormLabel>
                UX Instructions
              </FormLabel>
              <FormControl
                as="textarea"
                rows={40}
                cols={90}
                value={uxInstructions}
                onChange={(e) => setUXInstructions(e.target.value)}
              />
              <Button onClick={generateHTML}>Generate HTML</Button>
            </Form>
          </Col>
          <Col style={{ minWidth: '700px', maxWidth: '700px' }}>
            <Form>
              <FormLabel>
                Output HTML
              </FormLabel>
              <FormControl
                as="textarea"
                rows={15}
                cols={90}
                value={htmlCode}
                onChange={(e) => {
                  htmlCodeRef.current = e.target.value;
                  setHTMLCode(e.target.value)
                }}
              />
              <Button onClick={reRenderHTML} >Re-Render</Button>
              <Button onClick={convertToSVG} >Convert to svg</Button>
            </Form>
          </Col>
          <Col style={{ minWidth: '400px', maxWidth: '400px', minHeight: '800px' }}>
            <div>
              {!!showSpinner && (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              )}
              <iframe  width="400" height="1200" id="html-input-phone"  ref={iframeMobileRef} src="http://localhost:3000/other/htmlToConvert.html"> </iframe>
            </div>
          </Col>
          <Col style={{ width: '300px' }}>

            <div className="svg-preview" style={{ width: '258px' }} dangerouslySetInnerHTML={{ __html: svgPhone }}></div>

          </Col>
          <Col style={{ minWidth: '1024px', maxWidth: '1024px', minHeight: '800px' }}>
            <div>
              {!!showSpinner && (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              )}
              <iframe  width="1024" height="1200" id="html-input-desktop"  ref={iframeDesktopRef} src="http://localhost:3000/other/htmlToConvert.html"> </iframe>
            </div>
          </Col>
        
          <Col style={{ width: '300px' }}>
            <Card>
              <Card.Body>
                <div className="svg-preview" style={{ width: '648px' }} dangerouslySetInnerHTML={{ __html: svgDesktop }}></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>


    </div>
  );
};


export default Home;
