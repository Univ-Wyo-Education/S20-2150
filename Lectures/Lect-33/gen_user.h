
typedef struct ColumnStruct {
	char *ColumnName;
	char *ColumnType;
	char *ColumnIndex;
	char *ColumnComment;
} ColumnData;

typedef struct TableStruct {
	char *TableName;
	int nColumns;
	int nAlloc;
	ColumnData **Columns;
} TableData;

int strprefix ( char *s, char *prefix);
void trimSpaces ( char *line, char *tmp );
void getCom ( char *line, char *com );
void trimNL ( char *line );
void appendCol ( TableData *TabData, int pos, char *col, char *typ, char *ind, char *com );
int read_data(char *fn, int pos, TableData *TabData);
char *QuoteIt ( char *txt, char *buf );
char *genType( char *ColumnType, char *ColumnIndex, char *buf );
void gen_table();
void gen_comments();

