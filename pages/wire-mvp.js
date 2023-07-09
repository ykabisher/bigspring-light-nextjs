import config from "@config/config.json";
import Base from "@layouts/Baseof";
import "swiper/swiper.min.css";
import { Button, Container, Form, FormGroup, FormControl, Card, FormLabel, Stack, Spinner, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [uxInstructions, setUXInstructions] = useState(``);
  const [showSpinner, setShowSpinner] = useState(false);
  const [htmlCode, setHTMLCode] = useState(``)
  const [svgDesktop, setSVGDesktop] = useState('')
  const [svgPhone, setSVGPhone] = useState('')

  const [isOneScreen, setIsOneScreen] = useState(true)

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
    const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/screengen2?debug=true', {
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

    const jsResp = await response.json()

    setHTMLCode(jsResp.code)
    setSVGDesktop(jsResp.svgDesktop),
      setSVGPhone(jsResp.svgPhone),
      renderHTML('phone')
    renderHTML('desktop')
    setShowSpinner(false);
  };

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
    doc.body.innerHTML = htmlCode;

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
    const svgs = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/html_to_svg', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: htmlCode
    });
    const json = await svgs.json()

    setSVGDesktop(json.desktop)
    setSVGPhone(json.phone)
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
                onChange={(e) => setHTMLCode(e.target.value)}
              />
              <Button onClick={reRenderHTML} >Re-Render</Button>
            </Form>
          </Col>
          <Col style={{ minWidth: '400px', maxWidth: '400px', minHeight: '800px' }}>
            <div>
              {!!showSpinner && (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              )}
              <iframe scrolling="no" width="400" height="1200" id="html-input-phone" src="http://localhost:3000/other/htmlToConvert.html"> </iframe>
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
              <iframe scrolling="no" width="1024" height="1200" id="html-input-desktop" src="http://localhost:3000/other/htmlToConvert.html"> </iframe>
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
