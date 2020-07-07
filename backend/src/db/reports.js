const models = require('../models');
const Sequelize = require('sequelize');
const db = require('../sequalize_pg');
const Op = Sequelize.Op;

const getReportDetails = async (year) => {
    const startOfCurrentYear = new Date(year, 0);
    const startOfNextYear = new Date(year + 1, 0);
    const report = await db.query(RAW_REPOT_QUERY, {
        replacements: {
            startDate: startOfCurrentYear,
            endDate: startOfNextYear
        }
    });
    return report;
};

module.exports = {
    getReportDetails
}

const RAW_REPOT_QUERY = `
   SELECT
   course_type_id as "course_id", ticket_total as "ticket_total" , start as "start_date", name as "name"
    FROM
    (
      SELECT
         eventDetails.start,
         eventDetails."courseId",
         count(*) as "ticket_total"
      FROM
         (
            SELECT
               id,
               start,
               "courseId"
            FROM
               events
            WHERE
               start BETWEEN (:startDate) AND (:endDate)
         )
         as eventDetails
         INNER JOIN
            (
               SELECT
                  "eventId"
               FROM
                  reservations
               WHERE
                  "bookingStatus" = 1
            )
            as reservationDetails
            ON eventDetails.id = reservationDetails."eventId"
      GROUP BY
         eventDetails.id,
         eventdetails.start,
         eventDetails."courseId"
   ) as ticketDetails
   INNER JOIN
      (
         SELECT
            id,
            name,
            course_type_id
         FROM
            courses
      )
      as courseDetails
      ON "courseId" = courseDetails.id
      ORDER BY start_date DESC
    `;
