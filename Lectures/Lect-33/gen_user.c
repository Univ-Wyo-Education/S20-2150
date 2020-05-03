#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include "gen_user.h"

// -----------------------------------------------------------------------------
TableData *TabData;
int db1 = 0;
int nTabData = 0;
int test1 = 0;
int test2 = 0;


/*
### Table: user

| Column Name  | Column Type | Index | Description                                     |
|--------------|-------------|-------|-------------------------------------------------|
| id           | uuid        | PK    | Unique generated ID for this tables row         |
| username     | text        | UK    | the name of the user (usually an email address) |
| real_name    | text        | P     | persons name                                    |
| password_enc | text        |       | encrypted password for user                     |
*/

// -----------------------------------------------------------------------------
int strprefix ( char *s, char *prefix) {
	if ( strlen(s) > strlen(prefix)
		&& strncmp ( s, prefix, strlen(prefix) ) == 0 ) {
		return 1;
	}
	return 0;
}

// -----------------------------------------------------------------------------
void trimSpaces ( char *line, char *tmp ) {
	while ( *line != '\0' && ( *line == ' ' || *line == '\t' ) ) {
		line++;
	}
	int ln = strlen(line);
	strcpy ( tmp, line );
	for ( ln--; ln > 0 && ( tmp[ln] == ' ' || tmp[ln] == '\t' ); ln-- ) {
	}
	if ( ln >= -1 ) {
		tmp[ln+1] = '\0';
	}
}

// -----------------------------------------------------------------------------
// Skip over 4 | to get to the comment.  Continue to next |.  Trim 
// leading/trailing spaces.
void getCom ( char *line, char *com ) {
	com[0] = '\0';		// Assume empty.
	int sl = strlen(line);
	char *sp = NULL;
	for ( int n = 0, k = 0; k < sl; k++ ) {
		if ( line[k] == '|' ) {
			n++;
		}
		if ( n == 4 ) {
			sp = line+(k+1);
			break;
		}
	}
	if ( sp && sp < line+sl ) {
		strncpy ( com, sp, 1024 );
	}
	for ( char *t = com; *t; t++ ) {
		if ( *t == '|' ) {
			*t = '\0';
		}
	}
	char tmp[1024];
	trimSpaces ( com, tmp );
	strcpy ( com, tmp );
}

// -----------------------------------------------------------------------------
void trimNL ( char *line ) {
	int n = strlen(line);
	if ( n > 0 ) {
		if ( line[n-1] == '\n' ) {
			line[n-1] = '\0';
		}
	}
}

// -----------------------------------------------------------------------------
void appendCol ( TableData *TabData, int pos, char *col, char *typ, char *ind,
char *com ) {
	ColumnData *x = (ColumnData *)malloc ( sizeof(ColumnData) );
	x->ColumnName = strdup(col);
	x->ColumnType = strdup(typ);
	x->ColumnIndex = strdup(ind);
	x->ColumnComment = strdup(com);
	int colNo = TabData[pos].nColumns;
	if ( colNo == 0 || TabData[pos].Columns == NULL ) {
		TabData[pos].Columns = (ColumnData **)malloc (
			sizeof ( ColumnData * ) * 10 );
		TabData[pos].nAlloc = 10;
	} else if ( colNo > 0 && TabData[pos].nAlloc < (colNo+1) ) {
		TabData[pos].Columns = (ColumnData **)realloc ( TabData[pos].Columns,
			sizeof ( ColumnData * ) * (10+TabData[pos].nAlloc) );
		TabData[pos].nAlloc += 10;
	}
	TabData[pos].Columns[colNo] = x;
	TabData[pos].nColumns++;
}
	


// -----------------------------------------------------------------------------
int read_data(char *fn, int pos, TableData *TabData) {
	char line[1024];
	FILE *fp;

	if ( ( fp = fopen ( fn, "r" ) ) == NULL ) {
		int errnum = errno;
      	fprintf(stderr, "Error opening file %s: %s\n", fn, strerror( errnum ));
		return 0;
	}
	int line_no = 0;
	int st = 0, nc;
	char j1[1024], j2[1024], name[1024];
	char col[1024], typ[1024], ind[1024], com[1024];

	while ( fgets ( line, 1024, fp ) != NULL ) {
		trimNL ( line );
		line_no++;
		if ( db1 ) printf ( "%3d: st=%d ->%s<-\n", line_no, st, line );
		if ( strprefix ( line, "### Table:" ) ) {
			st = 1;
			sscanf ( line, "%s%s%s", j1, j2, name );
			if ( db1 ) printf ( "%3d:   name=->%s<-\n", line_no, name );
			TabData[pos].TableName = strdup ( name );
		} else if ( st == 1 && strprefix ( line, "|---") ) {
			st = 2;
		} else if ( st == 2 && line[0] == '\n' ) {
			st = 3;
			if ( db1 ) printf ( "%3d: end\n", line_no );
		} else if ( st == 2 ) {
			if ( db1 ) printf ( "%3d: st=%d Found Column ->%s<-\n", line_no, st, line );
			int n = sscanf ( line, "%s%s%s%s%s%s%s", j1, col, j1, typ, j1, ind, j2 );
			if ( strcmp ( ind, "|" ) == 0 ) {
				ind[0] = '\0';
			}
			getCom ( line, com );
			if ( db1 )
				printf ( "n=%d col ->%s<- typ ->%s<- ind ->%s<- j2 ->%s<- com ->%s<-\n",
					n, col, typ, ind, j2, com );
			appendCol ( TabData, pos, col, typ, ind, com );
		}
	}
	fclose ( fp );
	nTabData++;
	return 1;
}
 
// -----------------------------------------------------------------------------
char *QuoteIt ( char *txt, char *buf ) {
	sprintf ( buf, "\"%s\"", txt );
	return buf;
}

// -----------------------------------------------------------------------------
char *genType( char *ColumnType, char *ColumnIndex, char *buf ) {
	if ( strcmp ( ColumnIndex, "PK" ) == 0 && strcmp ( ColumnType, "uuid" ) == 0 ) {
		sprintf ( buf, "uuid DEFAULT uuid_generate_v4() not null primary key" );
		return buf;
	}
	return ColumnType;
}

// -----------------------------------------------------------------------------
void gen_table() {
	char buf[1024];
	char buf2[1024];
	for ( int i = 0; i < nTabData; i++ ) {
		printf ( "\nDROP TABLE if exists \"%s\";\n", TabData[i].TableName );
		printf ( "\nCREATE TABLE \"%s\" (\n", TabData[i].TableName );
		for ( int cn = 0; cn < TabData[i].nColumns; cn++ ) {
			char *comma = ",";
			if ( ! ( cn+1 < TabData[i].nColumns ) ) {
				comma = "";
			}
			printf ( "\t%-12s\t%s%s\n",
				QuoteIt(TabData[i].Columns[cn]->ColumnName,buf),
				genType( TabData[i].Columns[cn]->ColumnType,
					TabData[i].Columns[cn]->ColumnIndex, buf2), comma );
		}
		printf ( "\n);\n\n" );
	}
}


// -----------------------------------------------------------------------------
void gen_index() {
	char buf[1024];
	int nu = 1;
	int np = 1;

	for ( int i = 0; i < nTabData; i++ ) {
		for ( int cn = 0; cn < TabData[i].nColumns; cn++ ) {
			if ( strcmp ( TabData[i].Columns[cn]->ColumnIndex, "UK" ) == 0 ) {
				printf ( "CREATE UNIQUE INDEX \"%s_%d_uk\" on \"%s\" ( %s );\n",
					TabData[i].TableName, nu++, TabData[i].TableName,
					QuoteIt(TabData[i].Columns[cn]->ColumnName,buf) );
			}
			if ( strcmp ( TabData[i].Columns[cn]->ColumnIndex, "P" ) == 0 ) {
				printf ( "CREATE INDEX \"%s_%d\" on \"%s\" ( %s );\n",
					TabData[i].TableName, np++, TabData[i].TableName,
					QuoteIt(TabData[i].Columns[cn]->ColumnName,buf) );
			}
		}
	}
	printf ( "\n" );
}

// -----------------------------------------------------------------------------
void gen_comments() {
	for ( int i = 0; i < nTabData; i++ ) {
		for ( int cn = 0; cn < TabData[i].nColumns; cn++ ) {
			if ( strlen ( TabData[i].Columns[cn]->ColumnComment) > 0 ) {
				printf ( "COMMENT ON COLUMN \"%s\".\"%s\" IS '%s';\n",
					TabData[i].TableName,
					TabData[i].Columns[cn]->ColumnName,
					TabData[i].Columns[cn]->ColumnComment);
			}
		}
	}
	printf ( "\n" );
}


// -----------------------------------------------------------------------------
int main ( int argc, char *argv[] ) {
	// fprintf ( stderr, "AT: %d\n", __LINE__ );
	TabData = (TableData *)malloc( sizeof(TableData) * 10 );
	for ( int i = 0; i < 10; i++ ) {
		TabData[i].nColumns = 0;
		TabData[i].nAlloc = 0;
		TabData[i].Columns = NULL;
	}


	if ( test1 ) {
		if ( ! strprefix ( "abcd", "ab" ) ) {
			printf ( "bad 1\n" );
		}
		if ( strprefix ( "abcd", "abcdef" ) ) {
			printf ( "bad 1\n" );
		}
		if ( strprefix ( "abcd", "aD" ) ) {
			printf ( "bad 1\n" );
		}
	}
	if ( test2 ) {
		char buf[100];
		char tmp[1024];
		strcpy ( buf, "  abc def      " );
		trimSpaces ( buf, tmp );
		printf ( "trimSpaces 1 ->%s<-\n", tmp );

		strcpy ( buf, "abc " );
		trimSpaces ( buf, tmp );
		printf ( "trimSpaces 2 ->%s<-\n", tmp );

		strcpy ( buf, " " );
		trimSpaces ( buf, tmp );
		printf ( "trimSpaces 3 ->%s<-\n", tmp );
	}

	for ( int ii = 1; ii < argc; ii++ ) {
		read_data(argv[ii], ii-1, TabData);
	}

	gen_table();
	gen_comments();
	gen_index();

	return 0;
}

