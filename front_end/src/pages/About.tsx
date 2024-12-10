import React from "react";
import "./About.css";

import co1 from "../assets/collaborators_photos/co-1.png";
import co2 from "../assets/collaborators_photos/co-2.jpg";
import co3 from "../assets/collaborators_photos/co-3.jpeg";
import data_pipeline_diagram from "../assets/data_processing_pipeline_numbered.png";

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-page__section about-page__about-project">
        <h2 className="about-page__heading">About the project</h2>
        <p className="about-page__text">
          The goal of this project is to automate the collection, summarization,
          and open-sourcing of data related to the disappearances of
          self-identifying females in Mexico. Additionally, the project aims to
          present the data in a standardized format, ensuring it is easily
          comparable and citable.
        </p>
        <h2 className="about-page__heading">Data pipeline</h2>
        <p className="about-page__text">
          The data pipeline is designed to run a schedule twice a day for
          reported cases for which we have the name of the case subject so that
          we may provide timely updates. The following diagram illustrates the
          steps for data processing.
        </p>
        <img
          src={data_pipeline_diagram}
          alt="Diagram of data processing. Navigate below for written steps."
          className="about-page__diagram"
        />
        <ol className="circular-list about-page__text">
          <li>A user inputs the names of affected victims for new cases.</li>
          <li>
            These names are stored in a text file, which acts as the input for
            the data pipeline.
          </li>
          <li>
            For each name, the data pipeline queries the News API to retrieve
            the top 10 most relevant news articles.
          </li>
          <li>The retrieved news article data is stored in a database.</li>
          <li>
            The pipeline then queries the database for all news articles related
            to the case, including both stored and newly retrieved articles.
          </li>
          <li>
            Using this data, the pipeline sends a prompt and the article content
            to a GPT-4o-mini model.
          </li>
          <li>
            The GPT-4o-mini model summarizes the case details based on the
            information from the news articles.
          </li>
          <li>The summarized case details are saved in the database.</li>
          <li>
            <b>The public endpoint:</b> an API retrieves the list of cases from
            the database and delivers the information via HTTP requests.
          </li>
        </ol>
      </section>

      <section className="about-page__section about-page__data-pipeline">
        <h2 className="about-page__heading">Data processing</h2>
        <p className="about-page__text">
          The data pipeline processes data seamlessly from source to analysis,
          leveraging state-of-the-art technologies.
        </p>
      </section>

      <section className="about-page__section about-page__collaborators">
        <h2 className="about-page__heading">Collaborators</h2>
        <div className="about-page__collaborators-container">
          <div className="about-page__collaborator">
            <img src={co1} alt="" className="about-page__photo" />
            <p className="about-page__bio">Katie Arriaga</p>
          </div>
          <div className="about-page__collaborator">
            <img src={co2} alt="" className="about-page__photo" />
            <p className="about-page__bio">Arnavi Chheda</p>
          </div>
          <div className="about-page__collaborator">
            <img src={co3} alt="" className="about-page__photo" />
            <p className="about-page__bio">Medina Lamkin</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
