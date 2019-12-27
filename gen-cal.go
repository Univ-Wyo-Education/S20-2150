package main

import (
	"fmt"
	"time"
)

func main() {

	isoDateFmt := "2006-01-02"

	start_s := "2020-01-27" // Monday Jan 27
	end_s := "2020-05-09"   // Friday May 8

	spring_br_start_s := "2020-03-15"
	spring_br_end_s := "2020-03-21"

	// start := time.Now()
	// end := start.AddDate(0, 0, 6)
	start, err := time.Parse(isoDateFmt, start_s)
	if err != nil {
	}
	end, err := time.Parse(isoDateFmt, end_s)
	if err != nil {
	}
	fmt.Printf("Semester From %s to %s\n", start.Format("2006-01-02"), end.Format("2006-01-02"))

	start_sb, err := time.Parse(isoDateFmt, spring_br_start_s)
	if err != nil {
	}
	end_sb, err := time.Parse(isoDateFmt, spring_br_end_s)
	if err != nil {
	}
	fmt.Printf("Spring Break From %s to %s\n", start_sb.Format("2006-01-02"), end_sb.Format("2006-01-02"))

	cn := 1

	for rd := rangeDate(start, end); ; {
		date := rd()
		// fmt.Printf("Date Is: %s\n", date.Format("2006-01-02"))
		if date.IsZero() {
			break
		}

		if date.After(start_sb) && date.Before(end_sb) {
			fmt.Printf("| %s | *spring break - no class* |\n", date.Format("Mon Jan 02 2006"))
			continue
		}

		// weekday := time.Now().Weekday()
		weekday := date.Weekday()
		if weekday == time.Monday || weekday == time.Wednesday || weekday == time.Friday {
			fmt.Printf("| %s | %02d | \n", date.Format("Mon Jan 02 2006"), cn)
			cn++
		}
	}
}

// rangeDate returns a date range function over start date to end date inclusive.
// After the end of the range, the range function returns a zero date,
// date.IsZero() is true.
func rangeDate(start, end time.Time) func() time.Time {
	y, m, d := start.Date()
	start = time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
	y, m, d = end.Date()
	end = time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	return func() time.Time {
		if start.After(end) {
			return time.Time{}
		}
		date := start
		start = start.AddDate(0, 0, 1)
		return date
	}
}
