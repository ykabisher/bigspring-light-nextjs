import config from "@config/config.json";
import "swiper/swiper.min.css";
import { Button, Container, Form, FormGroup, FormControl, Card, FormLabel, Stack, Spinner, Row, Col } from 'react-bootstrap';
import { useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const { title } = config.site;

  const [generatedHtml, setGeneratedHtml] = useState('');
  const [inputDS, setDS] = useState(``);
  const [inputPrompt, setPrompt] = useState(``);
  const [showSpinner, setShowSpinner] = useState(false);
  const [exp, setExp] = useState('')
  //const [questions, setQuestions] = useState([{ text: 'how are you?', answeres: ['good', 'not good'], ans: '' }])
  const [questions, setQuestions] = useState([])

  const handleAskQuestions = async () => {
    setShowSpinner(true);
    setExp('')
    const response = await fetch('https://us-central1-slides-ai-376007.cloudfunctions.net/ds_gen3', {
      // const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_gen3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: inputPrompt })
    });
    const jsResp = await response.json()
    if (jsResp?.question) {
      const newQuestions = [];
      newQuestions.push({ text: jsResp.question, answeres: jsResp.possible_answeres, finalAnswer: '' })
      setQuestions(newQuestions)
      setShowSpinner(false);
    } else {
      generateUX()
    }



  };

  const generateHTML = async () => {
    setShowSpinner(true);
    setGeneratedHtml('')
    const response = await fetch('https://us-central1-slides-ai-376007.cloudfunctions.net/ds_generate_html', {
      // const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_generate_html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: exp })
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
      <style>
    div.toast {
      display: block !important;
      border-color: black  !important;
    }
    button {
      background: white;
      font-weight: 500 !important;
      border-width: 2px !important;
      color: black !important;
    }
    button.btn-secondary {
      background: white !important;
    }
   
    </style>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
      <title>Book Reader App</title>
    </head>
    ${jsResp.content}
  </html>
  `
    setGeneratedHtml(htmlTemplate);
    setShowSpinner(false);

  };

  const generateUX = async (newQuestions) => {

    setShowSpinner(true);

    let answeres = ``;
    (newQuestions || questions).forEach((q) => {
      answeres += `Question: ${q.text}, Answer: ${q.finalAnswer}.\n`
    })

    setExp('')
    const response = await fetch('https://us-central1-slides-ai-376007.cloudfunctions.net/ds_gen_answered', {
      // const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_gen_answered', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: inputPrompt, ans_questions: answeres })
    });
    const jsResp = await response.json()


    setExp(jsResp.content)
    // setGeneratedHtml(htmlTemplate);

    setShowSpinner(false);
  }

  const answerQuestion = async (index, ans) => {
    const newQuestions = []
    for (let i = 0; i <= index; i++) {
      newQuestions[i] = { ...questions[i] }
    }
    newQuestions[index].finalAnswer = ans;

    setQuestions(newQuestions)
    setShowSpinner(true);

    const answeres = [];
    newQuestions.forEach((q) => {
      answeres.push({
        role: "assistant",
        content: q.text
      })
      answeres.push({
        role: "user",
        content: q.finalAnswer
      })
    })
    const response = await fetch('https://us-central1-slides-ai-376007.cloudfunctions.net/ds_gen3', {
      // const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_gen3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ds: inputDS, prompt: inputPrompt, ans_questions: answeres })
    });
    const jsResp = await response.json()

    if (jsResp?.question) {
      newQuestions.push({ text: jsResp.question, answeres: jsResp.possible_answeres, ans: '' })
      setShowSpinner(false);
      setQuestions(newQuestions)
    } else {
      generateUX(newQuestions)
    }



  }

  // const handleGenerateUX = async () => {
  //   setShowSpinner(true);
  //   setExp('')
  //   // const response = await fetch('https://ds-gen1-jrsxmikr5q-uc.a.run.app', {
  //   const response = await fetch('http://127.0.0.1:5001/slides-ai-376007/us-central1/ds_gen_answered', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ ds: inputDS, prompt: inputPrompt })
  //   });
  //   const jsResp = await response.json()


  //   setExp(jsResp.content)
  //   // setGeneratedHtml(htmlTemplate);


  //   setShowSpinner(false);

  // };

  return (
    <div style={{ margin: '15px' }} >
      <Form>
        <Row style={{ flexWrap: 'inherit' }}>
          <Col style={{ minWidth: '600px', maxWidth: '600px', height: '90vh' }}>
            <FormGroup style={{ width: '100%' }}>
              <FormLabel>
                <h4>Ver. 5: Design System .md Format</h4>

              </FormLabel>
              <FormControl
                as="textarea"
                style={{ height: '95vh' }}
                value={inputDS}
                onChange={(e) => setDS(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col style={{ minWidth: '600px', maxWidth: '600px', height: '90vh' }}>
            <Stack gap={3}>
              <FormGroup style={{ width: '100%' }}>
                <FormLabel>
                  <h4>The UI is about...</h4>

                </FormLabel>
                <FormControl
                  as="textarea"
                  style={{ height: '40vh' }}
                  value={inputPrompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </FormGroup>
              <Button onClick={handleAskQuestions}>Ask Questions</Button>

              {questions.map((question, key) => {
                return <div key={key}>
                  <p >{question.text}</p>
                  <Stack direction="horizontal" gap={2}>
                    {question.answeres.map((ans, ansKey) =>
                      <Button onClick={() => { answerQuestion(key, ans) }} key={ansKey} variant={question.finalAnswer === ans ? "success" : "secondary"}>{ans}</Button>)}
                  </Stack>

                </div>
              })}

            </Stack>
          </Col>
          <Col style={{ minWidth: '600px', maxWidth: '600px', height: '90vh' }}>
            <FormGroup className="me-auto" style={{ width: '100%' }}>
              <FormLabel>
                <h4>How to build the UI</h4>

              </FormLabel>
              <FormControl
                as="textarea"
                style={{ height: '85vh' }}
                onChange={(e) => setExp(e.target.value)}
                value={exp}
              />
            </FormGroup>
            {!!exp && <Button onClick={generateHTML}>Generate UI</Button>}

          </Col>
          <Col >
            <h4>HTML Preview</h4>
            <Card>
              <Card.Body>

                <iframe
                  title="Generated HTML"
                  srcdoc={generatedHtml}
                  style={{ width: '1024px', height: '400px', border: 'none' }}
                />

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
      {!!showSpinner && <div className="custom-overlay">
        <div className="overlay-content">
          <Spinner animation="border" />
        </div>
      </div>}
    </div >
  );
};


export default Home;
