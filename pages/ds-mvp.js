import config from "@config/config.json";
import Base from "@layouts/Baseof";
import "swiper/swiper.min.css";
import { Button, Container, Form, FormGroup, FormControl, Card, FormLabel, Stack, Spinner, Row, Col } from 'react-bootstrap';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const { title } = config.site;

  const [generatedHtml, setGeneratedHtml] = useState('');
  const [inputDS, setDS] = useState('all buttons should be green');
  const [inputPrompt, setPrompt] = useState('log in screen');
  const [showSpinner, setShowSpinner] = useState(false);
  const [exp, setExp] = useState('')

  const handleGenerate = async () => {
    setShowSpinner(true);
    setExp('')
    const response = await fetch('https://ds-gen1-jrsxmikr5q-uc.a.run.app', {
    // const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_gen1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: inputPrompt })
    });
    const jsResp = await response.json()

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
  ${jsResp.style}
  <body>${jsResp.body}</body>

  
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <title>Book Reader App</title>
  </head>
  <body></body>
</html>
`
    setExp(jsResp.explanation)
    setGeneratedHtml(htmlTemplate);


    setShowSpinner(false);

  };

  return (
    <div >
    
      {/* workflow */}
      <Container>
        <Stack gap={3}>
          <Form>
          <Container>
      <Row>
        <Col xs={6}>
        <FormGroup className="me-auto" style={{ width: '100%' }}>
                <FormLabel>
                  Design System .md Format
                </FormLabel>
                <FormControl
                  as="textarea"
                  rows={15}
                  value={inputDS}
                  onChange={(e) => setDS(e.target.value)}
                />
              </FormGroup>
        </Col>
        <Col xs={6}>
        <Stack gap={3}>
                <FormGroup className="me-auto" style={{ width: '100%' }}>
                  <FormLabel>
                    The UI is about
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    rows={5}
                    value={inputPrompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </FormGroup>
                <Button onClick={handleGenerate}>Generate</Button>
                <FormGroup className="me-auto" style={{ width: '100%' }}>
                  <FormLabel>
                    Explanation
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    rows={5}
                    disabled
                    value={exp}
                  />
                </FormGroup>
              </Stack>
        </Col>
      </Row>
    </Container>
          
            
              
        
          </Form>
          <Card>
            <Card.Body>
              {showSpinner ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <iframe
                  title="Generated HTML"
                  srcdoc={generatedHtml}
                  style={{ width: '1024px', height: '400px', border: 'none' }}
                />
              )}
            </Card.Body>
          </Card>
        </Stack>
        version 2
      </Container>
  
    </div>
  );
};


export default Home;
