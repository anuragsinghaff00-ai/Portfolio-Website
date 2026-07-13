import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech, Computer Science</h4>
                <h5>Heritage Institute of Technology</h5>
              </div>
              <h3>2022-26</h3>
            </div>
            <p>
              CGPA: 8.7 / 10. Relevant coursework: Distributed Systems, Machine Learning, Operating Systems, Database Management Systems, Cloud Computing.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Competitive Coding</h4>
                <h5>Codeforces Master & ICPC</h5>
              </div>
              <h3>2023-26</h3>
            </div>
            <p>
              ICPC Regional Finalist (2024). Codeforces Master (Max Rating 2150). 4× Hackathon Winner: Smart India Hackathon (2024), HackHarvard (2024), ETHIndia (2023).
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineering Intern</h4>
                <h5>Google (Cloud AI/ML Infrastructure)</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Shipped automated Kubeflow & Vertex AI retraining pipelines, cutting model refresh to under 8h. Built Prometheus/Grafana drift monitoring and Redis/gRPC feature store cache layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
