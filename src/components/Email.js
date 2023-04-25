

export default function Email() {

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [mailto, setMailto] = useState("");
    const [cc, setCc] = useState("");


  const updateEditor = (msg) => {
    const emailInfo = emailerParser(msg);
    setSubject(emailInfo.subject);
    setContent(newLineParser(emailInfo.content));
  }

  const sendEmail = () => {
    axios
      .post(`${config.apiUrl}/email/send`, { mailto, cc, subject, content })
      .then((res) => {
        if (res.data) {
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    clearEmailInputs(setMailto, setCc, setSubject, setContent);
  }

    return (
        <div>
            <div>
                <label>Mailto: </label><input className="mailto-input"
                    type="text"
                    value={mailto}
                    onChange={(e) => setMailto(e.target.value)}
                />
            </div>
            <div>
                <label>CC: </label><input className="mailto-input"
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                />
            </div>
            <div>
                <label>Subject: </label><input className="subject-input"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
            <div>
                <button type="button" onClick={sendEmail}>Send</button>
            </div>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
    );
}