# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\vscode-colorize-tests\test\colorize-fixtures\test-6611.rs
# Merge Date: 2026-05-07T19:22:32.824396
# ---

impl Foo<A,B>
    where A: B
{ }

impl Foo<A,B> for C
    where A: B
{ }

impl Foo<A,B> for C
{
    fn foo<A,B> -> C
        where A: B
    { }
}

fn foo<A,B> -> C
    where A: B
{ }

struct Foo<A,B>
    where A: B
{ }

trait Foo<A,B> : C
    where A: B
{ }