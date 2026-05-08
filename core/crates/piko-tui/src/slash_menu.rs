# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-tui\src\slash_menu.rs
# Merge Date: 2026-05-07T19:26:02.886912
# ---

#[derive(Debug, Clone)]
pub enum TypeaheadSource {
    SlashCommand,
}

#[derive(Debug, Clone)]
pub struct TypeaheadSuggestion {
    pub text: String,
    pub description: String,
    pub source: TypeaheadSource,
}

pub fn compute_typeahead(
    input: &str,
    slash_commands: &[(String, String)],
) -> Vec<TypeaheadSuggestion> {
    let mut suggestions = Vec::new();

    if let Some(cmd_prefix) = input.strip_prefix('/') {
        if cmd_prefix.contains(' ') {
            return suggestions;
        }
        let prefix_lower = cmd_prefix.to_lowercase();
        for (name, desc) in slash_commands {
            if name.to_lowercase().starts_with(&prefix_lower) {
                suggestions.push(TypeaheadSuggestion {
                    text: format!("/{}", name),
                    description: desc.to_string(),
                    source: TypeaheadSource::SlashCommand,
                });
            }
        }
    }

    suggestions
}
