import React, { Component } from "react";

const data = [
  {
    status: "Open",
    name: "Andrew",
    location: "Room 101",
    topics: ["React", "Parcel"],
  },
];

const HeadCell = ({ children }) => (
  <th style={{ textAlign: "center" }}>{children}</th>
);

const BodyCell = ({ children }) => (
  <td style={{ textAlign: "center" }}>{children}</td>
);

const TableRow = ({ ticket }) => (
  <tr>
    <BodyCell>
      <span
        className="tag is-medium is-success"
        style={{ textTransform: "uppercase", fontWeight: 700 }}
      >
        {ticket.status}
      </span>
    </BodyCell>
    <BodyCell>{ticket.name}</BodyCell>
    <BodyCell>{ticket.location}</BodyCell>
  </tr>
);

class TicketTable extends Component {
  render() {
    this.dot = 1;
    return (
      <div className="box content" style={{ borderRadius: 0 }}>
        <table className="table is-fullwidth" style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <HeadCell>Status</HeadCell>
              <HeadCell>Name</HeadCell>
              <HeadCell>Location</HeadCell>
              <HeadCell>Topics</HeadCell>
            </tr>
          </thead>
          <tbody>
            {data.map((ticket, i) => (
              <TableRow key={i} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TicketTable;
