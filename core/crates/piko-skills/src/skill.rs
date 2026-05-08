# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-skills\src\skill.rs
# Merge Date: 2026-05-07T19:26:01.630910
# ---

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Skill {
    pub name: String,
    pub description: String,
    pub args: Vec<String>,
    pub prompt_template: String,
    pub source: SkillSource,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum SkillSource {
    BuiltIn,
    User,
}

impl Skill {
    pub fn render(&self, args: &[&str]) -> String {
        let mut result = self.prompt_template.clone();
        for (i, arg_name) in self.args.iter().enumerate() {
            let value = args.get(i).copied().unwrap_or("");
            result = result.replace(&format!("{{{{{}}}}}", arg_name), value);
        }
        result
    }
}
