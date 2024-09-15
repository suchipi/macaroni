export const helpText = `Usage: macaroni [options] <files...>

Options:
  --include-paths <path1,path2,...>
    Comma-separated list of search paths for the builtin #INCLUDE rule;
    folders which contain the filenames you pass to #INCLUDE(...).

  --max-iterations <number>
    Maximum number of times to process macros. When the maximum number of
    iterations is reached, macro expansion is aborted and the process exits
    with a nonzero exit status. The default value is 10.

  --rules <path1,path2,...>
    Comma-separated list of macro rules to load (JavaScript files which export
    functions). By default, only the builtin #INCLUDE rule is used.
    Note that when specifying custom rules, the #INCLUDE rule will not be
    present. Re-export \`require('@suchipi/macaroni').includeRule\` to use the
    #INCLUDE rule.
`;
