import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "./About.css";

import co1 from "../assets/collaborators_photos/co-1.png";
import co2 from "../assets/collaborators_photos/co-2.jpg";
import co3 from "../assets/collaborators_photos/co-3.jpeg";
import data_pipeline_diagram from "../assets/data_processing_pipeline_numbered.png";
import {
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";

const AboutPage: React.FC = () => {
  const apiRows = [
    {
      property: "id",
      type: "number",
      description: { content: "The unique ID for this case in the database" },
    },
    {
      property: "lat",
      type: "float",
      description: {
        content:
          "Approximate geographical latitude for where the case happened",
      },
    },
    {
      property: "location",
      type: "string",
      description: {
        content:
          "Approximate user-friendly location for where the case happened",
      },
    },
    {
      property: "long",
      type: "float",
      description: {
        content:
          "Approximate geographical longitude for where the case happened",
      },
    },
    {
      property: "meets_gender_violence_criteria",
      type: "'feminicidio' | 'violencia' | null",
      description: {
        content: (
          <>
            <p>Values:</p>
            <ul>
              <li>
                'feminicidio': can be confirmed that the case met criteria for
                femicide
              </li>
              <li>
                'violencia': can be confirmed that the case met criteria for
                gender-motivated violence
              </li>
              <li>null: we do not have data to claim gender-motivated crime</li>
            </ul>
          </>
        ),
      },
    },
    {
      property: "missing_date",
      type: "datetime",
      description: { content: "Date the victim went missing" },
    },
    {
      property: "relationship_with_aggressor",
      type: "string | null",
      description: {
        content:
          "Any non-null value, describes the relationship between the victim and the aggressor. If null, we don't have knowledge of the nature of the relationship if any.",
      },
    },
    {
      property: "status",
      type: "'activa' | 'cerrada' | null",
      description: {
        content: (
          <>
            <p>Values:</p>
            <ul>
              <li>'activa': the investigation is active/ongoing</li>
              <li>'violencia': the investigation is considered closed</li>
              <li>null: no information on the status of the investigation</li>
            </ul>
          </>
        ),
      },
    },
    {
      property: "summary",
      type: "string",
      description: {
        content: "GPT-generated summary of the case",
      },
    },
    {
      property: "victim_name",
      type: "string",
      description: {
        content: "Name of the case subject",
      },
    },
    {
      property: "victim_outcome",
      type: "'encontrada' | 'no encontrada' | 'muerta' | null ",
      description: {
        content: (
          <>
            <p>Values:</p>
            <ul>
              <li>'encontrada': the victim was found alive</li>
              <li>'no encontrada': the victim is still missing</li>
              <li>'muerta': the victim was confirmed to be dead</li>
              <li>null: no information on the status of the investigation</li>
            </ul>
          </>
        ),
      },
    },
  ];
  const apiColumns = [
    { columnKey: "property", label: "Property" },
    { columnKey: "type", label: "Type" },
    { columnKey: "description", label: "Description" },
  ];
  return (
    <div className="about-page">
      <section className="about-page__section about-page__about-project">
        <h2 className="about-page__heading">About the project</h2>
        <p className="about-page__text">
          The goal of this project is to automate the collection, summarization,
          and open-sourcing of data related to the disappearances of
          self-identifying females in Mexico. Additionally, the project aims to
          present the data in a standardized format, ensuring it is easily
          comparable and citable. The data for cases is extracted from news
          articles fetched through the{" "}
          <a href="https://newsapi.org/">News API</a> by querying news sources
          from Mexico. The data is then summarized and standardized with{" "}
          <a href="https://openai.com/index/hello-gpt-4o/">GPT-4o-mini</a> so it
          can be presented in a consisted, strutured schema to make it easier to
          analyze, query and cite.
        </p>
        <h2 className="about-page__heading">Data processing</h2>
        <p className="about-page__text">
          The data processing is designed to run a scheduled job twice a day to
          add and update reported cases for which we have the name of the case
          subject so that we may provide timely updates. The following diagram
          illustrates the steps for data processing.
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
        <h2 className="about-page__heading">How to read the data</h2>
        <p>
          When querying the API, the user will receive an array of objects where
          each object represents a tracked case for a missing female person.
        </p>
        <SyntaxHighlighter language="json" wrapLongLines={true}>
          {JSON.stringify(
            [
              {
                id: 1,
                lat: 19.7007,
                location: "Ventura Puente, Morelia, Michoacán",
                long: -101.1824,
                meets_gender_violence_criteria: "violencia",
                missing_date: "Tue, 03 Dec 2024 00:00:00 GMT",
                relationship_with_aggressor: "pareja",
                status: "cerrada",
                summary:
                  "Adriana Rodríguez, de 26 años, fue reportada como desaparecida el 3 de diciembre de 2024 tras salir de su casa para comprar tortillas.",
                victim_name: "Adriana Rodríguez",
                victim_outcome: "viva",
              },
            ],
            null,
            2
          )}
        </SyntaxHighlighter>
        <Table
          size="small"
          aria-label="API properties"
          className="about-page__apitable "
        >
          <TableHeader>
            <TableRow>
              {apiColumns.map((column: { columnKey: any; label: any }) => (
                <TableHeaderCell key={column.columnKey}>
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiRows.map((apiRowItem) => (
              <TableRow>
                <TableCell>
                  <TableCellLayout>{apiRowItem.property}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{apiRowItem.type}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>
                    {apiRowItem.description.content}
                  </TableCellLayout>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
