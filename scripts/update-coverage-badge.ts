import fs from 'fs/promises'
import path from 'path'

async function updateCoverageBadge() {
  try {
    // Read coverage summary
    const coverageSummary = JSON.parse(
      await fs.readFile(path.resolve('coverage/coverage-summary.json'), 'utf-8'),
    )

    // Get total statement coverage
    const coverage = Math.round(coverageSummary.total.statements.pct)

    // Determine badge color based on coverage percentage
    let color = 'red'
    if (coverage >= 90) {
      color = 'brightgreen'
    } else if (coverage >= 80) {
      color = 'green'
    } else if (coverage >= 70) {
      color = 'yellowgreen'
    } else if (coverage >= 60) {
      color = 'yellow'
    } else if (coverage >= 50) {
      color = 'orange'
    }

    // Read README
    const readmePath = path.resolve('README.md')
    const readme = await fs.readFile(readmePath, 'utf-8')

    // Update or add coverage badge
    const badgeRegex = /!\[Coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-\d+%25-[a-z]+\)/
    const newBadge = `![Coverage](https://img.shields.io/badge/coverage-${coverage}%25-${color})`

    const newReadme = readme.match(badgeRegex)
      ? readme.replace(badgeRegex, newBadge)
      : readme.replace('# mk-student-groups', `# mk-student-groups\n\n${newBadge}`)

    // Write updated README
    await fs.writeFile(readmePath, newReadme, 'utf-8')

    console.log(`Updated coverage badge to ${coverage}%`)
  } catch (error) {
    console.error('Error updating coverage badge:', error)
    process.exit(1)
  }
}

updateCoverageBadge()
