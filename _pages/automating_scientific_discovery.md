---
permalink: /automating-scientific-discovery
title: "Partial Automation of Scientific Discovery"
excerpt: "Partial Automation of Scientific Discovery"
author_profile: true
redirect_from: 
  - /automating-scientific-discovery/
---

{% include base_path %}

I am using the term "discovery" as a verb, not a noun. That is, I am concerned more with the partial automation of the *process of doing science*, rather than the more strict "automatic generation and verification of new facts about the world". In fact, the latter is subsumed by the former: whereas the latter is concerned with end-products (statements about the world and perhaps some information about how they were derived), the former is concerned with the instantiation of methods through which those aforementioned end-products are hypothesized and validated, e.g. semi-autonomous hypothesis generation, carrying out of experiments, interpretation of data, and so forth.

To a large extent, machines are already automating large swaths of the scientific landscape, in both the acquisition of data from wet-lab experiments and the analysis of such data. On the **acquisition side**, machines are automating (a) handling of materials and laboratory instruments, e.g. 10x sequencing platforms; (b) preprocessing of acquired signals, e.g. deconvolution algorithms in microscopes and error correction in spatial transcriptomics; and transformation of raw data into more semantic information to be used in downstream analyses, e.g. [motion tracking and pose estimation of animals in behavioral experiments](http://www.mackenziemathislab.org/deeplabcut). On the **analysis side**, machine learning has been particularly instrumental in extracting insights from the acquired data, e.g. automatic classification of cell types in single-cell omics datasets, or in-silico drug screening. (it should be noted that machine learning is also used to optimize data acquisition and preprocessing, e.g. learning quality control parameters that optimize some criteria further downstream.)

## Reading List

### General

1. [Waltz, D., & Buchanan, B. G. (2009). Automating science. Science, 324(5923), 43-44.](https://www.science.org/doi/full/10.1126/science.1172781)

2. [De Bie, T., De Raedt, L., Hernández-Orallo, J., Hoos, H. H., Smyth, P., & Williams, C. K. (2021). Automating data science: Prospects and challenges. arXiv preprint arXiv:2105.05699.](https://arxiv.org/pdf/2105.05699)

3. [Olson, R. S., Bartley, N., Urbanowicz, R. J., & Moore, J. H. (2016, July). Evaluation of a tree-based pipeline optimization tool for automating data science. In Proceedings of the genetic and evolutionary computation conference 2016 (pp. 485-492).](https://dl.acm.org/doi/pdf/10.1145/2908812.2908918)

4. [King, R. D., Costa, V. S., Mellingwood, C., & Soldatova, L. N. (2018). Automating sciences: Philosophical and social dimensions. IEEE Technology and Society Magazine, 37(1), 40-46.](https://ieeexplore.ieee.org/iel7/44/8307124/08307145.pdf)

5. [Dangovski, R., Shen, M., Byrd, D., Jing, L., Tsvetkova, D., Nakov, P., & Soljačić, M. (2021, May). We Can Explain Your Research in Layman's Terms: Towards Automating Science Journalism at Scale. In Proceedings of the AAAI Conference on Artificial Intelligence (Vol. 35, No. 14, pp. 12728-12737).](https://ojs.aaai.org/index.php/AAAI/article/view/17507/17314)
  
  * I think automatic reporting of scientific results in a journalistic, easily-digestible manner is actually quite an important task for the practice of science as a whole.

6. [Gil, Y., & Garijo, D. (2017, March). Towards automating data narratives. In Proceedings of the 22nd International Conference on Intelligent User interfaces (pp. 565-576).](https://dl.acm.org/doi/pdf/10.1145/3025171.3025193)

7. [Savage, N. (2012). Automating scientific discovery. Communications of the ACM, 55(5), 9-11.](https://dl.acm.org/doi/pdf/10.1145/2160718.2160723)

8. [Coley, C. W., Eyke, N. S., & Jensen, K. F. (2020). Autonomous discovery in the chemical sciences part I: Progress. Angewandte Chemie International Edition, 59(51), 22858-22893.](https://onlinelibrary.wiley.com/doi/pdf/10.1002/anie.201909987)

9. [Gil, Y., Greaves, M., Hendler, J., & Hirsh, H. (2014). Amplify scientific discovery with artificial intelligence. Science, 346(6206), 171-172.](https://www.science.org/doi/full/10.1126/science.1259439)

10. [Kitano, H. (2021). Nobel Turing Challenge: creating the engine for scientific discovery. npj Systems Biology and Applications, 7(1), 1-12.](https://www.nature.com/articles/s41540-021-00189-3)

11. [Kitano, H. (2016). Artificial intelligence to win the nobel prize and beyond: Creating the engine for scientific discovery. AI magazine, 37(1), 39-49.](https://ojs.aaai.org/index.php/aimagazine/article/download/2642/2532)

12. [Dybowski, R. (2020). Interpretable machine learning as a tool for scientific discovery in chemistry. New Journal of Chemistry, 44(48), 20914-20920.](https://pubs.rsc.org/en/content/articlehtml/2020/nj/d0nj02592e)

13. [Gil, Y. (2017). Thoughtful artificial intelligence: Forging a new partnership for data science and scientific discovery. Data Science, 1(1-2), 119-129.](https://content.iospress.com/articles/data-science/ds011)

14. [Coutant, A., Roper, K., Trejo-Banos, D., Bouthinon, D., Carpenter, M., Grzebyta, J., ... & King, R. D. (2019). Closed-loop cycles of experiment design, execution, and learning accelerate systems biology model development in yeast. Proceedings of the National Academy of Sciences, 116(36), 18142-18147.](https://www.pnas.org/doi/full/10.1073/pnas.1900548116)

15. [Gomez-Perez, J. M., Palma, R., & Garcia-Silva, A. (2017, October). Towards a human-machine scientific partnership based on semantically rich research objects. In 2017 IEEE 13th International Conference on e-Science (e-Science) (pp. 266-275). IEEE.](https://ieeexplore.ieee.org/iel7/8108702/8109104/08109145.pdf)

16. [Vasilevich, A., & de Boer, J. (2018). Robot-scientists will lead tomorrow's biomaterials discovery. Current Opinion in Biomedical Engineering, 6, 74-80.](https://www.sciencedirect.com/science/article/pii/S2468451117301058)

17. [Grizou, J., Points, L. J., Sharma, A., & Cronin, L. (2020). A curious formulation robot enables the discovery of a novel protocell behavior. Science advances, 6(5), eaay4237.](https://www.science.org/doi/full/10.1126/sciadv.aay4237)

18. [Ezer, D., & Whitaker, K. (2019). Point of View: Data science for the scientific life cycle. Elife, 8, e43979.](https://elifesciences.org/articles/43979)

19. [Hakuk, Y., & Reich, Y. (2020). Automated discovery of scientific concepts: Replicating three recent discoveries in mechanics. Advanced Engineering Informatics, 44, 101080.](https://www.sciencedirect.com/science/article/pii/S1474034620300495)

20. [Y. Reich and E. Subrahmanian, "The PSI Framework and Theory of Design," in IEEE Transactions on Engineering Management, vol. 69, no. 4, pp. 1037-1049, Aug. 2022, doi: 10.1109/TEM.2020.2973238.](https://ieeexplore.ieee.org/abstract/document/9013067)

21. [Melnikov, A. A., Poulsen Nautrup, H., Krenn, M., Dunjko, V., Tiersch, M., Zeilinger, A., & Briegel, H. J. (2018). Active learning machine learns to create new quantum experiments. Proceedings of the National Academy of Sciences, 115(6), 1221-1226.](https://www.pnas.org/doi/full/10.1073/pnas.1714936115)

22. [Masubuchi, S., Morimoto, M., Morikawa, S., Onodera, M., Asakawa, Y., Watanabe, K., ... & Machida, T. (2018). Autonomous robotic searching and assembly of two-dimensional crystals to build van der Waals superlattices. Nature communications, 9(1), 1-12.](https://www.nature.com/articles/s41467-018-03723-w)

23. [Conrad, C., & Gerlich, D. W. (2010). Automated microscopy for high-content RNAi screening. Journal of Cell Biology, 188(4), 453-461.](https://rupress.org/jcb/article/188/4/453/35790)

24. [Vanschoren, J., Blockeel, H., Pfahringer, B., & Holmes, G. (2012). Experiment databases. Machine Learning, 87(2), 127-158.](https://link.springer.com/content/pdf/10.1007/s10994-011-5277-0.pdf)

25. [Trobe, M., & Burke, M. D. (2018). The molecular industrial revolution: automated synthesis of small molecules. Angewandte Chemie International Edition, 57(16), 4192-4214.](https://onlinelibrary.wiley.com/doi/pdf/10.1002/anie.201710482)

26. [Schneider, P., & Schneider, G. (2016). De novo design at the edge of chaos: Miniperspective. Journal of medicinal chemistry, 59(9), 4077-4086.](https://pubs.acs.org/doi/full/10.1021/acs.jmedchem.5b01849)

27. [Chao, R., Mishra, S., Si, T., & Zhao, H. (2017). Engineering biological systems using automated biofoundries. Metabolic Engineering, 42, 98-108.](https://www.sciencedirect.com/science/article/pii/S1096717617300502)

28. [Lippi, G., & Da Rin, G. (2019). Advantages and limitations of total laboratory automation: a personal overview. Clinical Chemistry and Laboratory Medicine (CCLM), 57(6), 802-811.](https://www.degruyter.com/document/doi/10.1515/cclm-2018-1323/html)

29. [Genzen, J. R., Burnham, C. A. D., Felder, R. A., Hawker, C. D., Lippi, G., & Peck Palmer, O. M. (2018). Challenges and opportunities in implementing total laboratory automation. Clinical chemistry, 64(2), 259-264.](https://academic.oup.com/clinchem/article-pdf/64/2/259/32641920/clinchem0259.pdf)

30. [Liu, Y. E. (2015). Building behavioral experimentation engines (Doctoral dissertation, University of Washington).](https://digital.lib.washington.edu/researchworks/handle/1773/33692)


### Somewhat Outdated, yet interesting / important

1. Russo, M. F., & Echols, M. M. (1999). Automating science and engineering laboratories with visual basic. Wiley.

2. Dunbar, K., & Fugelsang, J. (2005). Scientific thinking and reasoning. The Cambridge handbook of thinking and reasoning, 705-725.

  * For better understanding the scientific process

3. [Buchanan, B., Sutherland, G., & Feigenbaum, E. A. (1969). Heuristic DENDRAL: A program for generating explanatory hypotheses. Organic Chemistry.](https://stacks.stanford.edu/file/druid:pf885vk0607/pf885vk0607.pdf)

4. Langley, P., Simon, H. A., Bradshaw, G. L., & Zytkow, J. M. (1987). Scientific discovery: Computational explorations of the creative processes. MIT press.

5. [Lindsay, R. K., Buchanan, B. G., Feigenbaum, E. A., & Lederberg, J. (1993). DENDRAL: a case study of the first expert system for scientific hypothesis formation. Artificial intelligence, 61(2), 209-261.](https://www.academia.edu/download/41637972/0000409.pdf)

6. Markin, R. S., & Whalen, S. A. (2000). Laboratory automation: trajectory, technology, and tactics. Clinical chemistry, 46(5), 764-771.



## People

1. [Yolanda Gil](https://scholar.google.com/citations?user=NDmGsCgAAAAJ&hl=en&oi=sra)

	* [Homepage](http://www.isi.edu/~gil)

2. [Ross D. King](https://www.ceb.cam.ac.uk/staff/professor-ross-king)

3. [Hiroaki Kitano](https://scholar.google.com/citations?user=027fc-oAAAAJ&hl=ja)

4. [Jose Manuel Gomez-Perez](https://scholar.google.com/citations?user=P3B2MmwAAAAJ&hl=en&oi=sra)

5. [Raul Palma](https://scholar.google.com/citations?user=xaTTVicAAAAJ&hl=en&oi=sra)

6. [Connor Coley](https://scholar.google.com/citations?user=l015S80AAAAJ&hl=en&oi=ao)

7. [Jonathan Grizou](https://scholar.google.com/citations?user=Fej-hGQAAAAJ&hl=en&oi=sra)

8. [Abishek Sharma](https://sites.google.com/site/aerospike2x/home?authuser=0)

9. [Nicholas Matiasz](https://www.matiasz.com)

10. [Yoram Reich](http://www.eng.tau.ac.il/~yoram/)

11. [Tobias Kuhn](http://www.tkuhn.org)

12. [Yun-En Liu](https://scholar.google.com/citations?user=3LgT9-UAAAAJ&hl=en)



[Jan De Boer](https://scholar.google.com/citations?hl=en&user=phHWCVsAAAAJ&view_op=list_works&sortby=pubdate)