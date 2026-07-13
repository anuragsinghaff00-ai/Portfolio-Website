import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./styles/Work.css";
import WorkImage from "./WorkImage";

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    {
      title: "ServeMesh",
      category: "Distributed Model Serving Platform",
      description: "A self-service platform letting teams deploy any model behind a versioned, autoscaled endpoint in under 5 minutes, achieving 99.9% uptime and sub-100ms p95 latency.",
      tools: "Kubernetes, Istio, Docker, TorchServe, ONNX Runtime, Kafka, Prometheus, React",
      image: "/images/servemesh.png",
      link: "https://github.com/anuragks"
    },
    {
      title: "Real-Time Fraud Detection",
      category: "Low-Latency Scoring Stream Pipeline",
      description: "Delivered sub-50ms fraud scoring via a streaming feature pipeline, cutting false negatives by 22% compared to legacy batch-scored systems at 10,000 transactions/second.",
      tools: "XGBoost, LightGBM, Kafka Streams, Apache Flink, Redis, gRPC, Docker",
      image: "/images/fraud_detection.png",
      link: "https://github.com/anuragks"
    },
    {
      title: "PipeForge",
      category: "AutoML Pipeline Orchestrator",
      description: "An end-to-end MLOps orchestration tool automating experiment tracking, hyperparameter search, and CI/CD-style model promotion, cutting model iteration time by 60%.",
      tools: "MLflow, Optuna, Apache Airflow, Docker, Python, PostgreSQL",
      image: "/images/pipeforge.png",
      link: "https://github.com/anuragks"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, projects.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        
        <div 
          className="work-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="work-slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map((project, index) => (
              <div className="work-slide" key={index}>
                <div className="work-slide-content">
                  <div className="work-info">
                    <div className="work-title">
                      <h3>0{index + 1}</h3>
                      <div>
                        <h4>{project.title}</h4>
                        <p className="work-category">{project.category}</p>
                      </div>
                    </div>
                    <p className="work-description">{project.description}</p>
                    <div className="work-tools-section">
                      <h4>Tools and features</h4>
                      <p className="work-tools">{project.tools}</p>
                    </div>
                  </div>
                  <div className="work-slide-image">
                    <WorkImage image={project.image} alt={project.title} link={project.link} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button 
            className="slider-btn prev-btn" 
            onClick={handlePrev} 
            aria-label="Previous slide"
          >
            <FiChevronLeft />
          </button>
          <button 
            className="slider-btn next-btn" 
            onClick={handleNext} 
            aria-label="Next slide"
          >
            <FiChevronRight />
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
