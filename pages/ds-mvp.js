import config from "@config/config.json";
import Base from "@layouts/Baseof";
import "swiper/swiper.min.css";
import { Button, Container, Form, FormGroup, FormControl, Card, FormLabel, Stack, Spinner } from 'react-bootstrap';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const { title } = config.site;

  const [generatedHtml, setGeneratedHtml] = useState('');
  const [inputDS, setDS] = useState('all buttons should be green');
  const [inputPrompt, setPrompt] = useState('log in screen');
  const [showSpinner, setShowSpinner] = useState(false);

  const handleGenerate = async () => {
    setShowSpinner(true);
    const response = await fetch('https://ds-gen1-jrsxmikr5q-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: inputPrompt })
    });
    const jsResp = await response.text()
    console.log(response)
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
  
  ${jsResp}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <title>Book Reader App</title>
  </head>
  <body></body>
</html>
`
    setGeneratedHtml(htmlTemplate);


    setShowSpinner(false);

  };

  return (
    <Base title={title}>
      {/* workflow */}
      <Container>
        <Stack gap={3}>
          <Form>
            <Stack direction="horizontal" gap={3}>
              <FormGroup className="me-auto" style={{ width: '100%' }}>
                <FormLabel>
                  Design System .md Format
                </FormLabel>
                <FormControl
                  as="textarea"
                  rows={5}
                  value={inputDS}
                  onChange={(e) => setDS(e.target.value)}
                />
              </FormGroup>
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
            </Stack>
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
      </Container>
    </Base>
  );
};


export default Home;
